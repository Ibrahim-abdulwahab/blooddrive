const request = require("../models/requestSchema");
const org = require("../models/organizationSchema");
const Donor = require("../models/donorSchema");
const calculateDistance = require('../utils/calculateDistance');
const { sendEmail } = require('../utils/emailService');

exports.createRequest = async (req,res)=>{
    try{

        if (req.body["patientFirstName"].trim() == "" ){
            return res.status(400).json({message:"Please fill in the patient's first name"});
        }

        if (req.body["patientLastName"].trim() == "" ){
            return res.status(400).json({message:"Please fill in the patient's last name"});
        }

        if (req.body["patientFirstName"].trim() == "" ){
            return res.status(400).json({message:"Please fill in the patient's first name"});
        }

        if (req.body["patientAge"] == "" ){
            return res.status(400).json({message:"Please fill in the patient's age"});
        }

        if (req.body["patientGender"] == "" ){
            return res.status(400).json({message:"Please select the patient's gender"});
        }

        if (req.body["patientBloodType"] == "" ){
            return res.status(400).json({message:"Please select the patient's blood type"});
        }

        if (req.body["hospital"] == ""){
            return res.status(400).json({message:"Please select the hospital that the patient is staying at"});
        }

        const hospital = await org.findOne({name : req.body["hospital"]});

        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        const latitude = hospital.coordinates.latitude;
        const longitude = hospital.coordinates.longitude;

        const MAX_DISTANCE_KM = 1250;


        // Convert MAX_DISTANCE_KM to meters (MongoDB uses meters in geospatial queries)
        const MAX_DISTANCE_METERS = MAX_DISTANCE_KM * 1000;


        let targetBlood=["O-"];

        if (req.body["patientBloodType"]=="0+"){
            targetBlood.push("O+");
        }

        if (req.body["patientBloodType"]=="B-"){
            targetBlood.push("B-");
        }

        if (req.body["patientBloodType"]=="B+"){
            targetBlood.push("O+");
            targetBlood.push("B-");
            targetBlood.push("B+");
        }

        if (req.body["patientBloodType"]=="A-"){
            targetBlood.push("A-");
        }

        if (req.body["patientBloodType"]=="A+"){
            targetBlood.push("O+");
            targetBlood.push("A-");
            targetBlood.push("A+");
        }

        if (req.body["patientBloodType"]=="AB-"){
            targetBlood.push("A-");
            targetBlood.push("B-");
            targetBlood.push("AB-");
        }

        if (req.body["patientBloodType"]=="AB+"){
            targetBlood.push("O+");
            targetBlood.push("B-");
            targetBlood.push("B+");
            targetBlood.push("A-");
            targetBlood.push("A+");
            targetBlood.push("AB-");
            targetBlood.push("AB+");
        }

        // Query for donors with the same blood type and within the distance range
        const donors = await Donor.find({
            bloodType: targetBlood,
            coordinates: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]  // [longitude, latitude]
                    },
                    $maxDistance: MAX_DISTANCE_METERS  // maximum distance in meters
                }
            }
        });

        const subject="Somebody needs your blood";

        for (const donor of donors) {
            // Email code here but for now console log
            console.log(donor.firstName);
            console.log(calculateDistance(latitude, longitude, donor.coordinates.coordinates[1], donor.coordinates.coordinates[0]));
            const text = `Hello ${donor.firstName}\n\n ${req.body["patientFirstName"].trim()} ${req.body["patientLastName"].trim()}, ${req.body["patientAge"]} years old, Needs your help at ${req.body["hospital"]}`;

            await sendEmail(donor.email, subject, text); // Send the email asynchronously
        };


        if (donors.length === 0){
            console.log("No nearby donors");
        }
        /*
        const newRequest = await request.create({
            patientFirstName: req.body["patientFirstName"],
            patientLastName: req.body["patientLastName"],
            patientAge: req.body["patientAge"],
            patientGender: req.body["patientGender"],
            patientBloodType: req.body["patientBloodType"],
            hospital: req.body["hospital"]
        });
        */
        

        return res.status(201).json({/*data:newRequest,*/ message:"Request created"})
    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
}


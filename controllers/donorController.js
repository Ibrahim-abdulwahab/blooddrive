const Donor = require("../models/donorSchema");
const validator = require("validator");
const calculateAge = require('../utils/calculateAge');
const { sendEmail } = require('../utils/emailService');
const { Coordinate } = require("../models/coordinatesSchema");
const mongoose = require("mongoose");
//
exports.signup = async (req,res)=>{
    try{
        if(!validator.isEmail(req.body["email"])){
            return res.status(400).json({message:"Invalid email address"});
        }
        if (!validator.isMobilePhone(req.body["phoneNumber"])){
                        return res.status(400).json({message:"Invalid phone number"});
        }

        if (req.body["firstName"].trim() == "" ){
            return res.status(400).json({message:"Please fill in your first name"});
        }

        if (req.body["lastName"].trim() == "" ){
            return res.status(400).json({message:"Please fill in your last name"});
        }

        let age=calculateAge(req.body["doB"]);

        if (age<18 || age>65){
            return res.status(400).json({message:"You are either too young or too old to be a donor"});
        }

        if (req.body["gender"] == "" ){
            return res.status(400).json({message:"Please select your gender"});
        }

        if (req.body["bloodType"] == "" ){
            return res.status(400).json({message:"Please select blood type"});
        }

        if (req.body["address"].trim() == "" ){
            return res.status(400).json({message:"Please type in your address"});
        }

        if (req.body["checkDiseases"] == ""){
            return res.status(400).json({message:"Please check if you have any history of diseases"});
        }

        if (req.body["checkDiseases"] === "Yes"){
            if (req.body["historyOfDiseases"] == ""){
                return res.status(400).json({message:"Please fill in your history of diseases"});
            }
        }

        if (req.body["checkDiseases"] === "No"){
            req.body["historyOfDiseases"] = "None"
        }

        const checkDonorExistenceByEmail = await Donor.findOne({email:req.body["email"]});
        const checkDonorExistenceByPhone = await Donor.findOne({phoneNumber:req.body["phoneNumber"]});

        if(checkDonorExistenceByEmail){
            return res.status(409).json({message:"Email is already registered as a donor"});
        }

        if(checkDonorExistenceByPhone){
            return res.status(409).json({message:"Phone is already registered as a donor"});
        }

        

        if(req.body["password"] !== req.body["passwordConfirm"]){
            return res.status(400).json({message: "Password and password confirm do not match"});
        }

        const newCoordinate = await Coordinate.create({
            type: 'Point', // Specifies that this is a geospatial point
            coordinates: [req.body["longitude"], req.body["latitude"]], // [longitude, latitude]
        });
        

        const newDonor = await Donor.create({
            firstName: req.body["firstName"],
            lastName: req.body["lastName"],
            doB: req.body["doB"],
            gender: req.body["gender"],
            bloodType: req.body["bloodType"],
            historyOfDiseases: req.body["historyOfDiseases"],
            address:req.body["address"],
            coordinates:newCoordinate,
            email: req.body["email"],
            phoneNumber: req.body["phoneNumber"],
            password: req.body["password"],
            passwordConfirm:req.body["passwordConfirm"],
            passwordChangedAt:Date.now(),
        });

        const { firstName, lastName, bloodType, email } = req.body;

        const subject = "Thank you for being a donor";
        const text = `Hello ${firstName} ${lastName},\n\nThank you for registering on our platform and becoming a donor. We will notify you when someone nearby is in need of ${bloodType}`;

        await sendEmail(email, subject, text); // Send the email asynchronously

        return res.status(201).json({data:newDonor,message:"Signup successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};


exports.login = async(req,res)=>{
    try{
        const {email,password} = req.body;

        const donor = await Donor.findOne({email});

        if (!donor || !(await donor.checkPassword(password, donor.password))){
            return res.status(401).json({message:"Invalid Credentials"});
        }

        return res.status(200).json({message:"Logged in successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }
};

exports.update= async(req,res)=>{
    try{
        const { email } = req.body;
        const donor = await Donor.findOne({email});

        if (!donor) {
            return res.status(404).json({ message: "Donor not found" });
        }

        const { newEmail, newAddress, newPhoneNumber, newHistoryOfDiseases,newLocation,newLatitude,newLongitude } = req.body;

        if(newEmail && !validator.isEmail(newEmail)){
            return res.status(400).json({message:"Invalid email address"});
        }

        if (newPhoneNumber && !validator.isMobilePhone(newPhoneNumber)){
            return res.status(400).json({message:"Invalid phone number"});
        }

        let hasUpdates = false;

        if(newEmail){
            donor.email = newEmail;
            hasUpdates = true;
        }
        if(newAddress){
            donor.address = newAddress;
            hasUpdates = true;
        }
        if(newPhoneNumber){
            donor.phoneNumber = newPhoneNumber;
            hasUpdates = true;
        }
        if(newHistoryOfDiseases){
            donor.historyOfDiseases =newHistoryOfDiseases;
            hasUpdates = true;
        }

        if (newLocation){
            const newCoordinate = await Coordinate.create({
                type: 'Point', // Specifies that this is a geospatial point
                coordinates: [req.body["longitude"], req.body["latitude"]], // [longitude, latitude]
            });
            donor.coordinates=newCoordinate;
            hasUpdates = true;
        }

        if(!hasUpdates){
            return res.status(400).json({message:"Please fill at least one field"});
        }

        await donor.save()
        
        return res.status(200).json({ message: "Donor information updated successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message});
    }

};

exports.delete = async(req,res)=>{
    try {
    const { email } = req.body;

    const donorToDelete = await Donor.findOne({email});
    
    if (!donorToDelete) {
      return res.status(404).json({ message: "Donor not found" });
    }

    const _id=donorToDelete._id
    

    // Validate if _id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid donor ID" });
    }

    const donor = await Donor.findByIdAndDelete(_id);

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    return res.status(200).json({ message: "Deleted Successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}
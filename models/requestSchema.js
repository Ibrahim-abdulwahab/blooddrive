const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const OrganizationSchema= require("./organizationSchema");

const requestSchema = new Schema({

    patientFirstName:{
        type:String,
        required:true,
        trim: true,
        minLength:3,
        maxLength:50
    },
    patientLastName:{
        type:String,
        required:true,
        trim: true,
        minLength:3,
        maxLength:50
    },
    patientAge:{
        type:Number,
        required:true
    },
    patientGender:{
        type:String,
        required:true,
        enum:["Male","Female","Others"],
        default: "Male"
    },
    patientBloodType:{
        type:String,
        required:true,
        enum:["A+","A-","B+","B-","AB+","AB-","O+","O-"],
        default:"AB+"
    },
    hospital:{
        type:String,
        required:true
    }
},
{timestamps: true}
);

module.exports=mongoose.model("Request",requestSchema);
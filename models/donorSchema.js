const mongoose = require("mongoose");
const { coordinatesSchema } = require("../models/coordinatesSchema"); 
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const donorSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        trim: true,
        minLength:3,
        maxLength:50
    },
    lastName:{
        type:String,
        required:true,
        trim: true,
        minLength:3,
        maxLength:50
    },
    doB:{
        type:Date,
        required:true
    },
    gender:{
        type:String,
        required:true,
        enum:["Male","Female","Others"],
        default: "Male",
    },
    bloodType:{
        type:String,
        required:true,
        enum:["A+","A-","B+","B-","AB+","AB-","O+","O-"],
        default:"AB+"
    },
    historyOfDiseases:{
        type:String,
        required:true,
        maxLength:250,
    },
    address:{
        type:String,
        required:true,
        maxLength:40,
        trim:true,
    },
    coordinates:{
        type:coordinatesSchema,
        required: true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim: true,
        maxLength:150,
        lowercase:true,
    },
    phoneNumber:{
        type: String,
        unique: true,
        required:true,
        trim: true,
        maxlength:20,
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength: 8,
    },
    passwordConfirm:{
        type: String,
        trim: true,
        minLength: 8,
    },
    passwordChangedAt: Date,
},
{timestamps: true}
);

// Create a 2dsphere index on the coordinates field for geospatial queries
donorSchema.index({ coordinates: '2dsphere' });

donorSchema.pre("save", async function(next){
    try{
        if(!this.isModified("password")){
            return next();
        }
        this.password = await bcrypt.hash(this.password,12);
        this.passwordConfirm = undefined;
    }catch(err){
        console.log(err)
    }
})

donorSchema.methods.checkPassword = async function(candidatePassword, donorPassword){
    return await bcrypt.compare(candidatePassword,donorPassword)
}

module.exports=mongoose.model("Donor",donorSchema);
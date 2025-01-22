const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//embedded object
const coordinatesSchema = new Schema({
  latitude: { 
    type: Number, 
    required: true 
  },
  longitude: { 
    type: Number, 
    required: true 
  }
});

const organizationSchema = new Schema({
    name:{
        type:String,
        required:[true],
    },
    type:{
        type:String,
        required:[true],
        enum:["Hospital,Bloodbank,Hospice","Medical center"],
        default:"Hospital",
    },
    country:{
        type:String,
        required:[true],
    },
    state:{
        type:String,
        required:[true]
    },
    cityOrTown:{
        type:String,
        required:[true]
    },
    coordinates:{
        type:coordinatesSchema,
        required: true
    }
    
},
{timestamps: true}
);

module.exports=mongoose.model("Organization",organizationSchema);
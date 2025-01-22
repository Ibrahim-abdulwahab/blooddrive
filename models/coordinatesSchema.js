const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//embedded object
const coordinatesSchema = new Schema({
  type: { type: String, enum: ['Point'], required: true },
  coordinates: {
    type: [Number],  // [longitude, latitude]
    required: true
  }
});

module.exports.coordinatesSchema = coordinatesSchema;

module.exports.Coordinate = mongoose.model('Coordinate', coordinatesSchema);
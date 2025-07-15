// backend/models/Meat.js
const mongoose = require("mongoose");

const MeatSchema = new mongoose.Schema({
  name: String,
  pricePerKg: Number,
  image: String,
  specs: [String],
});

module.exports = mongoose.model("Meat", MeatSchema);

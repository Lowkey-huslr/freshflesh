const mongoose = require("mongoose");

const butcherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  shopLocation: { type: String, required: true },
});

module.exports = mongoose.model("Butcher", butcherSchema);

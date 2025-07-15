// backend/controllers/MeatController.js
const Meat = require("../models/Meat");

const getAllMeats = async (req, res) => {
  const meats = await Meat.find();
  res.json(meats);
};

const addMeat = async (req, res) => {
  const { name, pricePerKg, image, specs, isAdmin } = req.body;

  if (!isAdmin) return res.status(403).json({ msg: "Unauthorized" });
  if (!name || !pricePerKg) return res.status(400).json({ msg: "Missing name or price" });

  try {
    const newMeat = new Meat({
      name,
      pricePerKg,
      image: image || "",
      specs,
    });
    await newMeat.save();
    res.status(201).json({ msg: "Meat added successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const deleteMeat = async (req, res) => {
  try {
    await Meat.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Meat deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
};

module.exports = { getAllMeats, addMeat, deleteMeat };

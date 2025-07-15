const Butcher = require("../models/Butcher");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const butcherSignup = async (req, res) => {
  try {
    const { name, phone, password, shopLocation } = req.body;

    const existing = await Butcher.findOne({ phone });
    if (existing) return res.status(400).json({ msg: "Phone already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newButcher = new Butcher({
      name,
      phone,
      password: hashed,
      shopLocation,
    });

    await newButcher.save();
    res.status(201).json({ msg: "Butcher registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

const butcherLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const butcher = await Butcher.findOne({ phone });
    if (!butcher) return res.status(400).json({ msg: "Invalid phone or password" });

    const isMatch = await bcrypt.compare(password, butcher.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid phone or password" });

    const token = jwt.sign({ id: butcher._id }, "secret_key", { expiresIn: "1d" });

    res.json({ token, butcher });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { butcherSignup, butcherLogin };

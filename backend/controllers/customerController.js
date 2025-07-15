const Customer = require("../models/Customer");

// 📱 Register or update customer
const registerOrUpdateCustomer = async (req, res) => {
  const { name, phone, address, addressCoords } = req.body;

  if (!name || !phone) return res.status(400).json({ msg: "Name and phone required" });

  try {
    let customer = await Customer.findOne({ phone });

    if (customer) {
      // update existing customer
      customer.name = name;
      customer.address = address;
      customer.addressCoords = addressCoords;
      await customer.save();
      return res.json({ msg: "Customer updated", customer });
    } else {
      // create new customer
      const newCustomer = new Customer({ name, phone, address, addressCoords });
      await newCustomer.save();
      return res.status(201).json({ msg: "Customer created", customer: newCustomer });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 🔍 Get customer by phone
const getCustomerByPhone = async (req, res) => {
  const { phone } = req.params;
  try {
    const customer = await Customer.findOne({ phone });
    if (!customer) return res.status(404).json({ msg: "Customer not found" });
    return res.json(customer);
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = {
  registerOrUpdateCustomer,
  getCustomerByPhone,
};

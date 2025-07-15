const express = require("express");
const router = express.Router();
const {
  registerOrUpdateCustomer,
  getCustomerByPhone,
} = require("../controllers/customerController");

// POST /api/customer/register
router.post("/register", registerOrUpdateCustomer);

// GET /api/customer/:phone
router.get("/:phone", getCustomerByPhone);

module.exports = router;

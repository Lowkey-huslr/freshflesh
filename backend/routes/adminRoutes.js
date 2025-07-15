const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  getPendingPayments,
  confirmPayment,
  getAllOrders,
  deleteButcher,
  updateOrderStatus
} = require("../controllers/adminController");

const Order = require("../models/Order");
const Butcher = require("../models/Butcher");

// 🔐 Admin Login
router.post("/login", loginAdmin);

// ✅ Get all pending UPI payments
router.get("/payment-pending", getPendingPayments);

// 🟢 Confirm payment for a customer's phone number
router.post("/confirm-payment/:phone", confirmPayment);

// 📦 Get all orders
router.get("/orders", getAllOrders);

// 👨‍🍳 Get all butchers
router.get("/butchers", async (req, res) => {
  try {
    const butchers = await Butcher.find();
    res.status(200).json(butchers);
  } catch (err) {
    res.status(500).json({ msg: "❌ Failed to fetch butchers" });
  }
});

// ❌ DELETE butcher by ID
router.delete("/butcher/:id", deleteButcher);

// 🧑‍🍳 Assign a butcher to an order
router.post("/assign-butcher", async (req, res) => {
  try {
    const { orderId, butcherId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    order.assignedButcher = butcherId;
    await order.save();

    res.status(200).json({ msg: "✅ Butcher assigned", order });
  } catch (err) {
    res.status(500).json({ msg: "❌ Failed to assign butcher" });
  }
});

// 📝 Update paymentStatus and deliveryStatus of an order
router.patch("/order-status/:id", updateOrderStatus);

module.exports = router;

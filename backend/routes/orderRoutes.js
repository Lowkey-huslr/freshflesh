const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getAllOrders,
  getOrdersByPhone,
  confirmPayment,
  assignButcher,
  markDelivered,
  updatePaymentStatus,
  checkPaymentStatus, // ✅ NEW
} = require("../controllers/orderController");

// ✅ Order placement
router.post("/new", placeOrder);

// ✅ Admin access routes
router.get("/all", getAllOrders);
router.get("/by-phone/:phone", getOrdersByPhone);

// ✅ Status updates
router.patch("/confirm-payment", confirmPayment);
router.patch("/assign-butcher", assignButcher);
router.patch("/mark-delivered", markDelivered);
router.put("/update-status", updatePaymentStatus);
router.post("/new", placeOrder);

// ✅ Frontend polling route for payment confirmation
router.get("/payment-status/:phone", checkPaymentStatus);

module.exports = router;

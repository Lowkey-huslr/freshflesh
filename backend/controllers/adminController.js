const Order = require("../models/Order");
const Butcher = require("../models/Butcher");

// ✅ Hardcoded admin credentials
const ADMIN_USERNAME = "Yash@1606";
const ADMIN_PASSWORD = "HGN@0212";

// 🔐 POST /api/admin/login
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  console.log("🛂 Admin login attempt:", username, password);

  try {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return res.status(200).json({ msg: "Login successful" });
    } else {
      return res.status(401).json({ msg: "Invalid username or password" });
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 📦 GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Error fetching all orders:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 💰 GET /api/admin/payment-pending
const getPendingPayments = async (req, res) => {
  try {
    const orders = await Order.find({
      paymentMode: "Online",
      isPaid: false,
    });

    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Error fetching pending payments:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ POST /api/admin/confirm-payment/:phone
const confirmPayment = async (req, res) => {
  const { phone } = req.params;

  try {
    const updated = await Order.findOneAndUpdate(
      { customerPhone: phone, isPaid: false },
      { isPaid: true, paymentStatus: "Done" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Order not found or already confirmed" });
    }

    res.status(200).json({ msg: "Payment confirmed ✅", order: updated });
  } catch (err) {
    console.error("❌ Error confirming payment:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ❌ DELETE /api/admin/butcher/:id
const deleteButcher = async (req, res) => {
  try {
    const deleted = await Butcher.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: "Butcher not found" });
    }
    res.status(200).json({ msg: "✅ Butcher deleted", butcher: deleted });
  } catch (err) {
    console.error("❌ Failed to delete butcher", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 🔄 PATCH /api/admin/order-status/:id
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { paymentStatus, deliveryStatus } = req.body;

  try {
    const updated = await Order.findByIdAndUpdate(
      id,
      { paymentStatus, deliveryStatus },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.status(200).json({ msg: "✅ Order status updated", order: updated });
  } catch (err) {
    console.error("❌ Failed to update order status", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = {
  loginAdmin,
  getAllOrders,
  getPendingPayments,
  confirmPayment,
  deleteButcher,
  updateOrderStatus,
};

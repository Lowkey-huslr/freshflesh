const Order = require("../models/Order");

// 📥 Place a new customer order
const placeOrder = async (req, res) => {
  try {
    const {
      cart,
      customerPhone,
      customerAddress,
      customerCoords,
      deliveryDate,
      deliveryTime,
      deliveryDistance,
      totalAmount,
      paymentMethod,
      paymentStatus,
    } = req.body;

    if (
      !cart ||
      !customerPhone ||
      !deliveryDate ||
      !deliveryTime ||
      !totalAmount ||
      !customerAddress ||
      !customerCoords
    ) {
      return res.status(400).json({ error: "Missing fields in order request" });
    }

    const totalMeatCost = cart.reduce(
      (acc, item) => acc + item.pricePerKg * item.quantity,
      0
    );

    // Estimate deliveryCharge from distance (fallback)
    let deliveryCharge = 0;
    if (deliveryDistance <= 2.5) {
      deliveryCharge = totalMeatCost > 3 ? (totalMeatCost - 3) * 5 : 0;
    } else if (deliveryDistance <= 3) {
      deliveryCharge = 20 + (totalMeatCost > 3 ? (totalMeatCost - 3) * 8 : 0);
    } else {
      deliveryCharge = 20 + Math.ceil(deliveryDistance - 3) * 4;
      if (totalMeatCost > 3) deliveryCharge += (totalMeatCost - 3) * 8;
    }

    deliveryCharge = Math.round(deliveryCharge);

    const order = new Order({
      cart,
      customerPhone,
      customerAddress,
      customerCoords,
      deliveryDate,
      deliveryTime,
      deliveryDistance,
      totalAmount: Math.round(totalAmount),
      totalMeatCost: Math.round(totalMeatCost),
      deliveryCharge,
      paymentMethod,
      paymentStatus,
    });

    await order.save();

    res.status(201).json({ message: "✅ Order placed", order });
  } catch (err) {
    console.error("❌ Error in placeOrder:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
};

// 📦 Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      msg: "❌ Failed to fetch orders",
      error: err.message,
    });
  }
};

// 📱 Get orders by customer phone
const getOrdersByPhone = async (req, res) => {
  try {
    const phone = req.params.phone;
    const orders = await Order.find({ customerPhone: phone }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ msg: "No orders found for this phone number" });
    }

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      msg: "❌ Failed to fetch orders by phone",
      error: err.message,
    });
  }
};

// ✅ Confirm payment by admin
const confirmPayment = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    order.paymentStatus = status;
    order.isPaid = status === "Paid" || status === "Done";
    await order.save();

    res.status(200).json({
      msg: "✅ Payment status updated",
      order,
    });
  } catch (err) {
    res.status(500).json({
      msg: "❌ Payment confirmation failed",
      error: err.message,
    });
  }
};

// 🧑‍🍳 Assign butcher
const assignButcher = async (req, res) => {
  try {
    const { orderId, butcherId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    order.assignedButcher = butcherId;
    await order.save();

    res.status(200).json({
      msg: "✅ Order assigned to butcher",
      order,
    });
  } catch (err) {
    res.status(500).json({
      msg: "❌ Failed to assign butcher",
      error: err.message,
    });
  }
};

// 📦 Mark as delivered
const markDelivered = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    order.delivered = true;
    await order.save();

    res.status(200).json({
      msg: "✅ Order marked as delivered",
      order,
    });
  } catch (err) {
    res.status(500).json({
      msg: "❌ Failed to mark as delivered",
      error: err.message,
    });
  }
};

// ✅ Polling: check payment status
const checkPaymentStatus = async (req, res) => {
  try {
    const phone = req.params.phone;

    const latestOrder = await Order.findOne({ customerPhone: phone }).sort({ createdAt: -1 });

    if (!latestOrder) return res.status(404).json({ isPaid: false, msg: "No order found" });

    const isPaid = latestOrder.paymentStatus === "Paid" || latestOrder.paymentStatus === "Done";

    res.status(200).json({ isPaid });
  } catch (err) {
    res.status(500).json({
      msg: "❌ Failed to check payment status",
      isPaid: false,
      error: err.message,
    });
  }
};

// 🔁 Update payment status by phone
const updatePaymentStatus = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone is required" });

    const order = await Order.findOne({ customerPhone: phone }).sort({ createdAt: -1 });
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.paymentStatus = "Paid";
    order.isPaid = true;
    await order.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to update payment status", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  placeOrder,
  getAllOrders,
  getOrdersByPhone,
  confirmPayment,
  assignButcher,
  markDelivered,
  checkPaymentStatus,
  updatePaymentStatus,
};

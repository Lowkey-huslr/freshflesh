const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerPhone: { type: String, required: true },
    customerName: { type: String, default: "" }, // Optional
    customerAddress: { type: String, default: "" },

    customerCoords: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },

    cart: [ // 🔁 Renamed from "items" to "cart" to match frontend payload
      {
        name: { type: String, required: true },
        pricePerKg: { type: Number, required: true },
        quantity: { type: Number, required: true },
        selectedSpecs: { type: [String], default: [] },
      },
    ],

    totalMeatCost: { type: Number, default: 0 },      // Optional but useful
    deliveryCharge: { type: Number, default: 0 },     // Optional but useful
    totalAmount: { type: Number, default: 0 },        // Matches frontend "totalAmount"

    deliveryDate: { type: String, required: true },
    deliveryTime: { type: String, required: true },

    paymentMethod: { type: String, enum: ["COD", "Online","UPI"], default: "COD" }, // 🔁 Match frontend field name

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Unpaid", "Done"],
      default: "Pending",
    },

    isPaid: { type: Boolean, default: false },

    assignedButcher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Butcher",
      default: null,
    },

    delivered: { type: Boolean, default: false },
  },
  {
    timestamps: true, // createdAt and updatedAt
  }
);

module.exports = mongoose.model("Order", orderSchema);

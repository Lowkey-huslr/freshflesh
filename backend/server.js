// 📦 Dependencies
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes");
const butcherRoutes = require("./routes/butcherRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/meats", require("./routes/meatRoutes"));
app.use("/api/order", require("./routes/orderRoutes"));
app.use("/api/butcher", require("./routes/butcherRoutes"));

// ✅ Connect to MongoDB once using the .env variable
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

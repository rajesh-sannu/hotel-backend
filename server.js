require("dotenv").config(); // ✅ Load environment variables

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // 🔌 MongoDB connection

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Optional: Logger for incoming requests
app.use((req, res, next) => {
  console.log(`🛰️  ${req.method} ${req.url}`);
  next();
});

// ✅ Import routes
const authRoutes = require("./routes/authRoutes");           // 🔐 Login, OTP, Reset Password
const userRoutes = require("./routes/userRoutes");           // 👤 Admin creates waiters
const orderRoutes = require("./routes/orderRoutes");         // 🧾 Orders
const menuRoutes = require("./routes/menuRoutes");           // 🍽️ Menu
const tableRoutes = require("./routes/tableRoutes");         // 🪑 Tables
const uploadRoutes = require("./routes/upload");             // 📸 Image Uploads
const analyticsRoutes = require("./routes/analyticsRoutes"); // 📊 Analytics
const adminRoutes = require("./routes/adminRoutes");         // 🛠️ Admin-specific (login activities)

// ✅ Route bindings
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes); // 👈 New line for admin routes

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 API is running");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

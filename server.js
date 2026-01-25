require("dotenv").config(); // ✅ Load environment variables

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // 🔌 MongoDB connection

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173", // for local dev (Vite)
      "http://localhost:3000",
      "https://your-app.vercel.app" // 🔴 CHANGE THIS after frontend deploy
    ],
    credentials: true
  })
);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend is running 🚀",
  });
});








app.use(express.json());

// ✅ Logger (safe for production)
app.use((req, res, next) => {
  console.log(`🛰️ ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Import routes
const authRoutes = require("./routes/authRoutes");           
const userRoutes = require("./routes/userRoutes");           
const orderRoutes = require("./routes/orderRoutes");         
const menuRoutes = require("./routes/menuRoutes");           
const tableRoutes = require("./routes/tableRoutes");         
const uploadRoutes = require("./routes/upload");             
const analyticsRoutes = require("./routes/analyticsRoutes"); 
const adminRoutes = require("./routes/adminRoutes");         

// ✅ Route bindings
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Health check route (VERY useful for Render)
app.get("/", (req, res) => {
  res.status(200).send("🚀 API is running successfully");
});

// ✅ Start server (Render will inject PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

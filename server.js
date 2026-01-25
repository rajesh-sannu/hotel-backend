require("dotenv").config(); // ✅ Load environment variables

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // 🔌 MongoDB connection

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware

// CORS configuration: allow local dev + deployed frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",          // Vite dev server
      "http://localhost:3000",          // optional React dev server
      "https://your-frontend.vercel.app" // 🔴 Replace with your deployed frontend URL
    ],
    credentials: true, // allow cookies/auth headers
  })
);

// ✅ Body parser
app.use(express.json());

// ✅ Logger middleware
app.use((req, res, next) => {
  console.log(`🛰️ ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Health check route (for Render monitoring or uptime checks)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend is running 🚀",
  });
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

// ✅ Default root route
app.get("/", (req, res) => {
  res.status(200).send("🚀 API is running successfully");
});

// ✅ Start server (Render injects PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

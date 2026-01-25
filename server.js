require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// ✅ Connect MongoDB
connectDB();

// ✅ CORS middleware: must be BEFORE routes
const allowedOrigins = [
  "http://localhost:5173",          // Vite dev
  "http://localhost:5178",          // your current local port
  "http://localhost:3000",          // optional
  "https://your-frontend.vercel.app" // deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true
}));

// ✅ Body parser
app.use(express.json());

// ✅ Logger
app.use((req, res, next) => {
  console.log(`🛰️ ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend is running 🚀"
  });
});

// ✅ Routes
const authRoutes = require("./routes/authRoutes");           
const userRoutes = require("./routes/userRoutes");           
const orderRoutes = require("./routes/orderRoutes");         
const menuRoutes = require("./routes/menuRoutes");           
const tableRoutes = require("./routes/tableRoutes");         
const uploadRoutes = require("./routes/upload");             
const analyticsRoutes = require("./routes/analyticsRoutes"); 
const adminRoutes = require("./routes/adminRoutes");         

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Default root
app.get("/", (req, res) => {
  res.status(200).send("🚀 API is running successfully");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

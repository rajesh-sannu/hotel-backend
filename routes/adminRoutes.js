// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const LoginActivity = require("../models/LoginActivity");
const jwt = require("jsonwebtoken");

// ======================= VERIFY ADMIN =======================
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ======================= GET LOGIN ACTIVITIES =======================
router.get("/logins", verifyAdmin, async (req, res) => {
  try {
    const logins = await LoginActivity.find().sort({ createdAt: -1 });
    res.json(logins);
  } catch (err) {
    console.error("Error fetching login activities:", err);
    res.status(500).json({ message: "Error fetching login activities" });
  }
});

// ======================= LOGOUT SPECIFIC SESSION =======================
router.post("/logout/:id", verifyAdmin, async (req, res) => {
  const sessionId = req.params.id;

  try {
    const session = await LoginActivity.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Option 1: Remove session from DB (force logout)
    await session.deleteOne();

    // Option 2: Or just mark as logged out
    // session.isLoggedOut = true;
    // await session.save();

    res.json({ message: "User session logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Error logging out session" });
  }
});

module.exports = router;

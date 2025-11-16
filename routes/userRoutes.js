const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ✅ Middleware to protect admin-only routes
function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// ✅ Admin creates waiter account
router.post("/add-waiter", verifyAdmin, async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "Email & Password required" });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(409).json({ message: "User already exists" });

  const newUser = new User({ name, email, password, role: "waiter" });
  await newUser.save();

  res.status(201).json({ message: "Waiter added successfully" });
});

module.exports = router;

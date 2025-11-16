// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const LoginActivity = require("../models/LoginActivity");
const sendEmail = require("../utils/sendEmail"); // updated util
const UAParser = require("ua-parser-js");

let otpStore = {}; // In-memory OTP store (per email)

// ======================= LOGIN =======================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Parse device info
    const parser = new UAParser(req.headers["user-agent"] || "");
    const uaResult = parser.getResult();
    const deviceType = uaResult.device.type || "desktop";
    const os = uaResult.os.name || "Unknown OS";
    const browser = uaResult.browser.name || "Unknown Browser";
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown IP";

    // Save login activity
    await LoginActivity.create({
      userId: user._id,
      email: user.email,
      role: user.role,
      type: deviceType,
      os,
      browser,
      ip,
      token,
    });

    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================= SEND OTP =======================
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    otpStore[email] = { otp, expiresAt };

    console.log(`🛰️ Generated OTP for ${email}: ${otp}`);

    // Always send OTP to fixed admin inbox
    const sent = await sendEmail(
      process.env.ADMIN_EMAIL,
      "Password Reset OTP",
      `OTP for user ${email} is: ${otp}\n\nThis code will expire in 5 minutes.`
    );

    if (!sent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.json({ message: "OTP sent to admin email" });
  } catch (err) {
    console.error("Error in send-otp:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================= RESET PASSWORD =======================
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const record = otpStore[email];

  if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword;
    await user.save(); // hash via pre-save hook

    delete otpStore[email]; // cleanup
    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

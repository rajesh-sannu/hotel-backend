// models/LoginActivity.js
const mongoose = require("mongoose");

const loginActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: String,
  role: { type: String, enum: ["admin", "waiter"], required: true },
  type: String,      // desktop / mobile / tablet
  os: String,
  browser: String,
  ip: String,
  token: String,      // <--- Store JWT for this session
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LoginActivity", loginActivitySchema);

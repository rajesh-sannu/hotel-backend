const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");

let currentOtp = "";

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  currentOtp = otp;

  await sendEmail(process.env.ADMIN_EMAIL, "Password Reset OTP", `OTP: ${otp}`);
  res.json({ message: "OTP sent to admin email" });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (otp !== currentOtp) return res.status(400).json({ message: "Invalid OTP" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate({ email }, { password: hashedPassword });

  currentOtp = "";
  res.json({ message: "Password changed successfully" });
};

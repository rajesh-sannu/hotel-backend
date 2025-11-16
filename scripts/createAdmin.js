const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const exists = await User.// createAdmin.js
require("dotenv").config(); // Load .env
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

const createAdmin = async () => {
  await connectDB();

  const existingAdmin = await User.findOne({ email: "admin@daba.com" });
  if (existingAdmin) {
    console.log("⚠️ Admin already exists!");
    return process.exit();
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = new User({
    name: "Super Admin",
    email: "19hn1a0429@aecn.in",
    password: hashedPassword,
    role: "admin",
  });

  await admin.save();
  console.log("✅ Admin created successfully!");
  process.exit();
};

createAdmin().catch((err) => {
  console.error("❌ Error creating admin:", err);
  process.exit(1);
});

});

// createWaiter.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User"); // Adjust if your model path differs

// Replace with your real Mongo URI
const MONGO_URI = "mongodb+srv://Raj:949323@cluster0.1jqo3vr.mongodb.net/menu";

async function createWaiter() {
  await mongoose.connect(MONGO_URI);
  const email = "waiter@daba.com";
  const password = "waiter123"; // You can change it
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("🚫 Waiter already exists");
    return process.exit();
  }

  const newUser = new User({
    email,
    password: hashedPassword,
    role: "waiter",
  });

  await newUser.save();
  console.log("✅ Waiter user created:", email);
  mongoose.disconnect();
}

createWaiter();

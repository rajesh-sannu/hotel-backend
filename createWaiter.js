const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User"); // adjust if different path

const MONGO_URI = "mongodb+srv://Raj:949323@cluster0.1jqo3vr.mongodb.net/menu";

async function createWaiter() {
  await mongoose.connect(MONGO_URI);

  const email = "waiter@daba.com";
  const password = "waiter123";
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

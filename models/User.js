//Users.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // ✅ match with auth.js

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
});

// Automatically hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  stock: {
    type: Number,
    default: 1, // ✅ default to "In Stock"
  },
});

module.exports = mongoose.model("MenuItem", menuItemSchema);

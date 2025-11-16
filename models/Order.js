const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    table: {
      type: Number,
      required: true,
    },

    // ✅ Add phone field
    phone: {
      type: String,
      required: false, // set to true if phone is mandatory
      trim: true,
    },

    items: [
      {
        name: String,
        price: Number,
        qty: Number,
        image: String,
      },
    ],

    discount: {
      type: Number,
      default: 0,
    },

    total: Number,
    netTotal: Number,
    finalAmount: Number, // ✅ required for analytics

    status: {
      type: String,
      enum: ["draft", "saved", "finalized", "deleted"],
      default: "draft",
    },
  },
  {
    timestamps: true, // ✅ Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Order", orderSchema);

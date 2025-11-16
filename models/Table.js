// models/Table.js
const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  status: { type: String, enum: ["vacant", "occupied"], default: "vacant" },
  occupiedAt: { type: Date, default: null }, // <-- NEW FIELD
});

module.exports = mongoose.model("Table", tableSchema);

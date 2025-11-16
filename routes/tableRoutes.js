// routes/tableRoutes.js
const express = require("express");
const router = express.Router();
const Table = require("../models/Table");

// GET all tables
router.get("/", async (req, res) => {
  const tables = await Table.find().sort({ id: 1 });
  res.json(tables);
});

// POST new table
router.post("/", async (req, res) => {
  const { id } = req.body;
  const existing = await Table.findOne({ id });
  if (existing) return res.status(400).json({ error: "Table already exists" });

  const newTable = new Table({ id, status: "vacant", occupiedAt: null });
  await newTable.save();
  res.json(newTable);
});

// PUT toggle table status and set/reset occupiedAt
router.put("/:id", async (req, res) => {
  const table = await Table.findOne({ id: req.params.id });
  if (!table) return res.status(404).json({ error: "Table not found" });

  if (table.status === "vacant") {
    table.status = "occupied";
    table.occupiedAt = new Date(); // set current time
  } else {
    table.status = "vacant";
    table.occupiedAt = null; // clear occupiedAt
  }

  await table.save();
  res.json(table);
});

// DELETE table
router.delete("/:id", async (req, res) => {
  const result = await Table.deleteOne({ id: req.params.id });
  res.json({ success: result.deletedCount > 0 });
});

module.exports = router;

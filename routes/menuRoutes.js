const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");
const multer = require("multer");
const { storage, cloudinary } = require("../utils/cloudinary");

const upload = multer({ storage });

// 🔍 GET all menu items
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    console.error("❌ GET menu error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ➕ POST create new item with image
router.post("/", upload.single("image"), async (req, res) => {
  console.log("📩 POST /api/menu hit");

  const { name, price, stock } = req.body;
  const image = req.file?.path;

  console.log("🛰 Name:", name);
  console.log("💰 Price:", price);
  console.log("📷 File:", req.file);
  console.log("📦 Stock:", stock);

  try {
    if (!name || !price || !image) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    const newItem = new MenuItem({
      name,
      price,
      image,
      stock: stock !== undefined ? stock : 1, // default to 1 if not given
    });

    const saved = await newItem.save();
    console.log("✅ Saved:", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Save error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✏️ PUT update item with optional new image
router.put("/:id", upload.single("image"), async (req, res) => {
  const { name, price, stock } = req.body; // ✅ FIXED: include stock
  const image = req.file?.path;

  console.log("📩 PUT /api/menu/:id hit");
  console.log("🔤 Name:", name);
  console.log("💰 Price:", price);
  console.log("📦 Stock:", stock);
  console.log("📷 Image file received:", req.file);

  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      console.error("❌ Item not found for update");
      return res.status(404).json({ error: "Item not found" });
    }

    // ✅ If new image uploaded, delete old one
    if (image && item.image) {
      const publicId = item.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`menu_items/${publicId}`);
      item.image = image;
      console.log("🧹 Old image deleted, new image set");
    }

    item.name = name || item.name;
    item.price = price || item.price;

    // ✅ Ensure stock is updated even if 0
    if (stock !== undefined) {
      item.stock = stock;
    }

    const updated = await item.save();
    console.log("✅ Item updated:", updated);
    res.json(updated);
  } catch (err) {
    console.error("❌ Update error:", err.message);
    res.status(500).json({ error: "Update failed" });
  }
});

// ❌ DELETE item + Cloudinary image
router.delete("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      console.error("❌ Item not found for delete");
      return res.status(404).json({ error: "Item not found" });
    }

    // ✅ Delete Cloudinary image
    if (item.image) {
      const publicId = item.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`menu_items/${publicId}`);
      console.log("🧹 Image deleted from Cloudinary");
    }

    await item.deleteOne();
    console.log("✅ Menu item deleted");
    res.json({ message: "Deleted item and image" });
  } catch (err) {
    console.error("❌ Delete failed:", err.message);
    res.status(400).json({ error: "Delete failed" });
  }
});

module.exports = router;

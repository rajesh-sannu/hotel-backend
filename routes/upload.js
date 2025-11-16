const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../utils/cloudinary");

const upload = multer({ storage });

// ✅ Upload Route
router.post("/", upload.single("image"), (req, res) => {
  console.log("🔥 Upload endpoint hit!");
  console.log("📷 Uploaded File:", req.file);

  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  return res.json({
    success: true,
    imageUrl: req.file.path,
    fileInfo: req.file,
  });
});

module.exports = router;

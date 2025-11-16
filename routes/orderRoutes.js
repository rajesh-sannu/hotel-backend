const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// ✅ Create or update order (used by Waiter)
router.post("/", async (req, res) => {
  const { table, phone, items, status } = req.body;

  try {
    const existing = await Order.findOne({
      table,
      status: { $in: ["saved", "submitted", "completed"] },
    });

    if (existing) {
      return res.status(400).json({
        message: `🚫 Table ${table} already has an active order in status "${existing.status}". Please wait for admin to finalize or delete it.`,
      });
    }

    let draft = await Order.findOne({ table, status: "draft" });

    if (draft) {
      draft.items = items;
      draft.phone = phone; // ✅ update phone
      draft.status = status;
      await draft.save();
      return res.json(draft);
    }

    const order = new Order({ table, phone, items, status }); // ✅ save phone
    await order.save();
    return res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all orders — for Waiter and Admin
router.get("/", async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};

  try {
    const orders = await Order.find(filter);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ✅ Update order — for Admin
router.put("/:id", async (req, res) => {
  const { status, items, discount, phone } = req.body;

  const updateFields = {};
  if (status) updateFields.status = status;
  if (items) updateFields.items = items;
  if (discount !== undefined) updateFields.discount = discount;
  if (phone) updateFields.phone = phone; // ✅ allow updating phone

  if (status === "finalized" && items && items.length > 0) {
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const netTotal = Math.round(total - total * (discount / 100));
    updateFields.total = total;
    updateFields.netTotal = netTotal;
    updateFields.finalAmount = netTotal; // ✅ Required for analytics
  }

  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
});

// ✅ Delete billing history
router.delete("/history", async (req, res) => {
  try {
    await Order.deleteMany({ status: { $in: ["finalized", "deleted"] } });
    res.json({ message: "Billing history deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete history" });
  }
});

// ✅ Verify reset password
router.post("/verify-reset", (req, res) => {
  const { password } = req.body;
  if (password === "admin123") { // change this to a secure env variable in real app
    return res.json({ success: true });
  } else {
    return res.json({ success: false });
  }
});

module.exports = router;

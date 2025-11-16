const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// 🟢 1. Summary: today, this week, this month
router.get("/summary", async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);

  const [today, week, month] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfToday } } },
      { $group: { _id: null, total: { $sum: "$netTotal" } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfWeek } } },
      { $group: { _id: null, total: { $sum: "$netTotal" } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$netTotal" } } },
    ]),
  ]);

  res.json({
    today: today[0]?.total || 0,
    week: week[0]?.total || 0,
    month: month[0]?.total || 0,
  });
});
// routes/highest- sales analyticsRoutes.js
router.get("/highest-sales-day", async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: { $sum: "$netTotal" },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);

    const result = orders[0] || { _id: null, total: 0 };

    res.json({ date: result._id, total: result.total });
  } catch (err) {
    console.error("Highest Sales Day Error:", err);
    res.status(500).json({ error: "Failed to fetch highest sales day" });
  }
});





// analyticsRoutes.js
router.get("/total-by-date", async (req, res) => {
  const { date } = req.query;
  const start = new Date(date);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  try {
    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end },
      status: "finalized",
    });

    const total = orders.reduce((sum, order) => sum + (order.netTotal || 0), 0);
    res.json({ total });
  } catch (err) {
    console.error("Error fetching total-by-date:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});





// 🟢 2. Bar Chart: Last 7 days daily total
router.get("/daily-totals", async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const daily = await Order.aggregate([
    {
      $match: { createdAt: { $gte: sevenDaysAgo } },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: "$netTotal" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const result = daily.map((d) => ({ date: d._id, total: d.total }));
  res.json(result);
});

// 🟢 3. Best Sellers: Top 5 items by quantity
router.get("/best-sellers", async (req, res) => {
  const bestItems = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.name",
        count: { $sum: "$items.qty" },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  const result = bestItems.map((item) => ({
    name: item._id,
    count: item.count,
  }));

  res.json(result);
});

// 🟢 4. Highest Sales Day
router.get("/highest-sales-day", async (req, res) => {
  const day = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: "$netTotal" },
      },
    },
    { $sort: { total: -1 } },
    { $limit: 1 },
  ]);

  res.json(day[0] || { date: "N/A", total: 0 });
});

// 🟢 5. This Month Total (same as summary.month, optional)
router.get("/monthly-total", async (req, res) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const monthly = await Order.aggregate([
    { $match: { createdAt: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: "$netTotal" } } },
  ]);

  res.json({ monthTotal: monthly[0]?.total || 0 });
});

module.exports = router;

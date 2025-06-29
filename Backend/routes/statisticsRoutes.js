// routes/statisticsRoutes.js
const express = require("express");
const router = express.Router();

const {
  overviewStatistics,
  getTestimonialStats,
} = require("../controllers/statisticsController");

// GET  /api/statistics/overview
router.get("/overview", overviewStatistics);

// GET  /api/statistics/testimonials
router.get("/testimonials", getTestimonialStats);

module.exports = router;

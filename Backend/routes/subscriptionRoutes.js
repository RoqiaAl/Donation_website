// 5. Route  (routes/subscriptionRoutes.js)
const express = require("express");
const router = express.Router();
const controller = require("../controllers/subscriptionController");

// POST  /api/subscriptions
router.post("/subscriptions", controller.subscribe);

// GET   /api/subscriptions
router.get("/subscriptions", controller.list);

module.exports = router;

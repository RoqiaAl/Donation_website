// routes/donorRoutes.js
const express = require("express");
const router = express.Router();
const donorController = require("../controllers/donordashboardController");
const authMiddleware = require("../utils/authMiddleware");

router.get(
  "/dashboard-statistics/:donorId",
  authMiddleware,
  donorController.donorDashboardStatistics
);
router.get(
  "/donations-charts/:donorId",
  authMiddleware,
  donorController.donationsAndCharts
);

router.get(
  "/profile/:donorId",
  authMiddleware,
  donorController.getDonorDetails
);
router.put(
  "/profile/:donorId",
  authMiddleware,
  donorController.updateDonorDetails
);
router.get(
  "/recurring-donations/:donorId",
  authMiddleware,
  donorController.getRecurringDonations
);
router.put(
  "/recurring-donations/:donationId/status",
  authMiddleware,
  donorController.updateRecurringDonationStatus
);

router.get(
  "/:donorId/transactions",
  authMiddleware,
  donorController.getDonorTransactions
);

router.get(
  "/:donorId/donations",
  authMiddleware,
  donorController.getDonorDonations
);

module.exports = router;

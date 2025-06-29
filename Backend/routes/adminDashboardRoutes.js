const express = require("express");
const adminDashboardController = require("../controllers/adminDashboardController");
const authenticationMiddleware = require("../utils/authMiddleware");

const router = express.Router();

// GET /api/admin/statistics
router.get(
  "/statistics",
  authenticationMiddleware,
  adminDashboardController.getDashboardStats
);
// GET /api/admin/charts
router.get(
  "/monthly-donations",
  authenticationMiddleware,
  adminDashboardController.getMonthlyDonations
);

// Donors by governorate endpoint
router.get(
  "/donors-by-governorate",

  adminDashboardController.getDonorsByGovernorate
);

router.get(
  "/top-by-donations",
  authenticationMiddleware,
  adminDashboardController.getTopProjectsByDonations
);
router.get(
  "/recent",
  authenticationMiddleware,
  adminDashboardController.getRecentDonations
);

router.get(
  "/users",
  authenticationMiddleware,
  adminDashboardController.getAllUsers
);
router.put(
  "/users/:id",
  authenticationMiddleware,
  adminDashboardController.editUserData
);
router.patch(
  "/users/:id/status",
  authenticationMiddleware,
  adminDashboardController.changeUserStatus
);

router.get("/donors", adminDashboardController.getAllDonors);
router.put("/donors/:id", adminDashboardController.updateDonor);
router.post("/donors/:id", adminDashboardController.createDonor); // POST /api/donors/:id

router.get("/donations", adminDashboardController.getAllDonations);

module.exports = router;

const express = require("express");
const router = express.Router();
const recurringDonationController = require("../controllers/recurringDonationController");

router.get(
  "/",
  recurringDonationController.getAll.bind(recurringDonationController)
); // Get all recurring donations
router.get(
  "/:id",
  recurringDonationController.getById.bind(recurringDonationController)
); // Get by ID
router.get(
  "/donor/:donorId",
  recurringDonationController.getByDonorId.bind(recurringDonationController)
); // Get by Donor ID
router.post(
  "/",
  recurringDonationController.create.bind(recurringDonationController)
); // Create new recurring donation
router.put(
  "/:id",
  recurringDonationController.update.bind(recurringDonationController)
); // Update recurring donation
router.patch(
  "/:id/status",
  recurringDonationController.updateStatus.bind(recurringDonationController)
); // ✅ Update status
router.delete(
  "/:id",
  recurringDonationController.delete.bind(recurringDonationController)
); // Delete recurring donation

module.exports = router;

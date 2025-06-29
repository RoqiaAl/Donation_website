const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.get("/", transactionController.getAll.bind(transactionController)); // Get all transactions
router.get("/:id", transactionController.getById.bind(transactionController)); // Get by ID
router.get(
  "/donor/:donorId",
  transactionController.getByDonorId.bind(transactionController)
); // Get by donor ID
router.get(
  "/donation/:donationId",
  transactionController.getByDonationId.bind(transactionController)
); // Get by donation ID
router.put("/:id", transactionController.update.bind(transactionController)); // Update transaction
router.delete("/:id", transactionController.delete.bind(transactionController)); // Delete transaction
// ✅ Update status
module.exports = router;

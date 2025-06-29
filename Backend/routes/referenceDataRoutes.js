const express = require("express");
const router = express.Router();
const referenceDataController = require("../controllers/referenceDataController");

// Get all items by type
router.get("/:type", referenceDataController.getByType);

// Create a new reference data item
router.post("/", referenceDataController.create);

// Bulk create items for a specific type
router.post("/:type/bulk", referenceDataController.bulkCreate);

// Update an existing item
router.put("/:id", referenceDataController.update);

// Delete an item
router.delete("/:id", referenceDataController.delete);

module.exports = router;

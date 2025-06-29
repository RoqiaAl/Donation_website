"use strict";
const express = require("express");
const router = express.Router();

// Import the parameterized upload middleware
const getUploadMiddleware = require("../utils/uploadMiddleware");
// Configure the middleware to store files in the "partners" folder (this saves files in public/partners)
const partnerUpload = getUploadMiddleware("partners");

const {
  createPartnerController,
  getAllPartnersController,
  getPartnerByIdController,
  updatePartnerController,
  deletePartnerController,
} = require("../controllers/partnerController");

// Create a new partner (with required logo file)
router.post("/", partnerUpload.single("partner_logo"), createPartnerController);

// Retrieve all partners
router.get("/", getAllPartnersController);

// Retrieve a partner by ID
router.get("/:id", getPartnerByIdController);

// Update a partner by ID (logo file optional)
router.put("/:id", partnerUpload.single("partner_logo"), updatePartnerController);

// Delete a partner by ID
router.delete("/:id", deletePartnerController);

module.exports = router;

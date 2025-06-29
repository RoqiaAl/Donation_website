"use strict";
const express = require("express");
const router = express.Router();

// Import the parameterized upload middleware
const getUploadMiddleware = require("../utils/uploadMiddleware");
// Configure the middleware to store files in the "testimonials" folder
const testimonialUpload = getUploadMiddleware("testimonials");

const {
  createTestimonial,
  listApprovedTestimonials,
  listAllTestimonials,
  updateTestimonialStatusController,
  
} = require("../controllers/testimonialController");

// Public endpoint to submit a testimonial (with optional image upload)
router.post("/", testimonialUpload.single("image"), createTestimonial);

// Public endpoint to list approved testimonials (for landing page display)
router.get("/", listApprovedTestimonials);
router.get("/all", listAllTestimonials);
router.get("/all", listAllTestimonials);
router.put("/:id/status", updateTestimonialStatusController);
module.exports = router;

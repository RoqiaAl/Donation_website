"use strict";
const {
  submitTestimonial,
  getApprovedTestimonials,

  getAllTestimonials,
  updateTestimonialStatus,
} = require("../services/testimonialService");

/**
 * Controller to create a testimonial.
 * Expects multipart/form-data with optional image file.
 */
async function createTestimonial(req, res) {
  try {
    // If using file upload middleware like multer, the file will be available as req.file.
    // Instead of storing the full URL, we'll store just the relative path.
    const imageUrl = req.file ? `/testimonials/${req.file.filename}` : null;

    const data = {
      name: req.body.name,
      email: req.body.email,
      content: req.body.content,
      imageUrl,
    };

    // Ensure "content" is present
    if (!data.content) {
      return res
        .status(400)
        .json({ success: false, message: "Content is required." });
    }

    const testimonial = await submitTestimonial(data);
    // Return the created testimonial, which now has a relative path in imageUrl.
    res.status(201).json({ success: true, testimonial });
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Controller to list approved testimonials.
 */
async function listApprovedTestimonials(req, res) {
  try {
    const testimonials = await getApprovedTestimonials();
    res.json({ success: true, testimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

async function listAllTestimonials(req, res) {
  try {
    const testimonials = await getApprovedTestimonials();
    res.json({ success: true, testimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

async function listAllTestimonials(req, res) {
  try {
    const testimonials = await getAllTestimonials();
    res.json({ success: true, testimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateTestimonialStatusController(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedTestimonial = await updateTestimonialStatus(id, status);
    res.json({ success: true, testimonial: updatedTestimonial });
  } catch (error) {
    console.error("Error updating testimonial status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  createTestimonial,
  listApprovedTestimonials,
  listAllTestimonials,
  updateTestimonialStatusController,
};

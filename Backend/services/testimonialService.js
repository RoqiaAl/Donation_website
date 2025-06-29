"use strict";
const { Testimonial } = require("../models");

/**
 * Creates a new testimonial.
 * If no status is provided, it defaults to "pending".
 * @param {Object} data - { name, email, content, imageUrl, status (optional) }
 * @returns {Promise<Testimonial>}
 */
async function submitTestimonial(data) {
  // Default status to "pending" if not provided
  if (!data.status) {
    data.status = "pending";
  }
  const testimonial = await Testimonial.create(data);
  return testimonial;
}

/**
 * Retrieves approved testimonials.
 * @returns {Promise<Array<Testimonial>>}
 */
async function getApprovedTestimonials() {
  const testimonials = await Testimonial.findAll({
    where: { status: "approved" },
    order: [["createdAt", "DESC"]],
  });
  return testimonials;
}

async function getAllTestimonials() {
  const testimonials = await Testimonial.findAll({
    order: [["createdAt", "DESC"]],
  });
  return testimonials;
}

/**
 * Retrieves approved testimonials.
 * @returns {Promise<Array<Testimonial>>}
 */
async function getAllTestimonials() {
  const testimonials = await Testimonial.findAll({
    order: [["createdAt", "DESC"]],
  });
  return testimonials;
}

/**
 * Updates the status of a testimonial.
 * @param {number} id - The ID of the testimonial to update.
 * @param {string} newStatus - The new status ("pending", "approved", or "rejected").
 * @returns {Promise<Testimonial>} - The updated testimonial.
 */
async function updateTestimonialStatus(id, newStatus) {
  const allowedStatuses = ["pending", "approved", "rejected"];
  if (!allowedStatuses.includes(newStatus)) {
    throw new Error(
      "Invalid status. Allowed statuses are 'pending', 'approved', and 'rejected'."
    );
  }

  const testimonial = await Testimonial.findByPk(id);
  if (!testimonial) {
    throw new Error("Testimonial not found.");
  }

  testimonial.status = newStatus;
  await testimonial.save();
  return testimonial;
}
module.exports = {
  submitTestimonial,
  getApprovedTestimonials,
  getAllTestimonials,
  updateTestimonialStatus,
};

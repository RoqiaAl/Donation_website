"use strict";
const {
  createPartner,
  getAllPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
} = require("../services/partnerService");

/**
 * Controller to create a new partner.
 * Expects multipart/form-data with keys:
 * - partner_name (required)
 * - partner_url (required)
 * - logo (file, required)
 */
async function createPartnerController(req, res) {
  try {
    // Using the file upload middleware, req.file will hold the uploaded file.
    // We store only the relative path.
    const partnerLogo = req.file ? `/partners/${req.file.filename}` : null;

    // Validate required fields
    if (!req.body.partner_name || !req.body.partner_url) {
      return res.status(400).json({
        success: false,
        message: "partner_name and partner_url are required.",
      });
    }
    if (!partnerLogo) {
      return res.status(400).json({
        success: false,
        message: "Partner logo is required.",
      });
    }

    const data = {
      partner_name: req.body.partner_name,
      partner_url: req.body.partner_url,
      partner_logo: partnerLogo,
    };

    const newPartner = await createPartner(data);
    return res.status(201).json({ success: true, partner: newPartner });
  } catch (error) {
    console.error("Error creating partner:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Controller to retrieve all partners.
 */
async function getAllPartnersController(req, res) {
  try {
    const partners = await getAllPartners();
    return res.json({ success: true, partners });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Controller to retrieve a partner by ID.
 */
async function getPartnerByIdController(req, res) {
  try {
    const { id } = req.params;
    const partner = await getPartnerById(id);
    if (!partner) {
      return res.status(404).json({ success: false, message: "Partner not found." });
    }
    return res.json({ success: true, partner });
  } catch (error) {
    console.error("Error fetching partner:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Controller to update a partner by ID.
 * Accepts multipart/form-data. The "logo" file is optional.
 */
async function updatePartnerController(req, res) {
  try {
    const { id } = req.params;
    // If a new logo is uploaded, use it; otherwise, do not update partner_logo.
    const partnerLogo = req.file ? `/partners/${req.file.filename}` : undefined;

    const data = {
      partner_name: req.body.partner_name,
      partner_url: req.body.partner_url,
    };

    // If a new logo was uploaded, include it in the update.
    if (partnerLogo !== undefined) {
      data.partner_logo = partnerLogo;
    }

    const updatedPartner = await updatePartner(id, data);
    if (!updatedPartner) {
      return res.status(404).json({ success: false, message: "Partner not found." });
    }
    return res.json({ success: true, partner: updatedPartner });
  } catch (error) {
    console.error("Error updating partner:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Controller to delete a partner by ID.
 */
async function deletePartnerController(req, res) {
  try {
    const { id } = req.params;
    const success = await deletePartner(id);
    if (!success) {
      return res.status(404).json({ success: false, message: "Partner not found." });
    }
    return res.json({ success: true, message: "Partner deleted successfully." });
  } catch (error) {
    console.error("Error deleting partner:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  createPartnerController,
  getAllPartnersController,
  getPartnerByIdController,
  updatePartnerController,
  deletePartnerController,
};

"use strict";
const {
  createProjectPartner,
  deleteProjectPartner,
  getPartnersByProjectId,
} = require("../services/projectPartnerService");

/**
 * Controller to create a new project-partner association.
 * Expects JSON body with { project_id, partner_id, ... }.
 */
async function createProjectPartnerController(req, res) {
  try {
    const data = {
      project_id: req.body.project_id,
      partner_id: req.body.partner_id,
      // Include any additional fields if needed:
      // e.g., percentage: req.body.percentage,
    };

    if (!data.project_id || !data.partner_id) {
      return res.status(400).json({
        success: false,
        message: "project_id and partner_id are required.",
      });
    }

    const association = await createProjectPartner(data);
    res.status(201).json({ success: true, projectPartner: association });
  } catch (error) {
    console.error("Error creating project-partner association:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Controller to delete a project-partner association.
 */
async function deleteProjectPartnerController(req, res) {
  try {
    const { id } = req.params;
    const success = await deleteProjectPartner(id);
    if (!success) {
      return res
        .status(404)
        .json({ success: false, message: "Association not found." });
    }
    res.json({ success: true, message: "Association deleted successfully." });
  } catch (error) {
    console.error("Error deleting association:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Controller to list partners for a given project.
 * Expects a project ID in req.params.
 */
async function listPartnersByProject(req, res) {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res
        .status(400)
        .json({ success: false, message: "Project ID is required." });
    }
    // This now returns an array of Partner objects, not the join records.
    const partners = await getPartnersByProjectId(projectId);
    return res.json({ success: true, partners });
  } catch (error) {
    console.error("Error fetching partners for project:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  createProjectPartnerController,

  deleteProjectPartnerController,

  listPartnersByProject,
};

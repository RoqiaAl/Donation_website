"use strict";
const { ProjectPartner, Partner } = require("../models");

/**
 * Creates a new project-partner association.
 * @param {Object} data - { project_id, partner_id, [additional_field(s)] }
 * @returns {Promise<ProjectPartner>}
 */
async function createProjectPartner(data) {
  const projectPartner = await ProjectPartner.create(data);
  return projectPartner;
}

/**
 * Deletes a project-partner association.
 * @param {number} id - The ID of the association.
 * @returns {Promise<boolean>} - Returns true if deleted, false if not found.
 */
async function deleteProjectPartner(id) {
  const association = await ProjectPartner.findByPk(id);
  if (!association) {
    return false;
  }
  await association.destroy();
  return true;
}

/**
 * Retrieves all project-partner associations for a given project,
 * including the associated Partner data.
 * @param {number} projectId - The ID of the project.
 * @returns {Promise<Array>} - An array of project-partner associations with partner details.
 */
/**
 * Retrieves only the partner data for a given project.
 * @param {number} projectId - The ID of the project.
 * @returns {Promise<Array<Partner>>} - An array of Partner objects.
 */
async function getPartnersByProjectId(projectId) {
  const projectPartners = await ProjectPartner.findAll({
    where: { project_id: projectId },
    include: [
      {
        model: Partner,
        as: "partner",
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  // Map the array of ProjectPartner records to just their 'partner' objects
  const partners = projectPartners.map((pp) => pp.partner);
  return partners;
}

module.exports = { createProjectPartner, deleteProjectPartner, getPartnersByProjectId };
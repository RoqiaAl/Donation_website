"use strict";
const { ProjectMedia } = require("../models");

/**
 * Creates a new ProjectMedia record.
 * @param {Object} data -
 *   {
 *     project_id,
 *     media_url,
 *     media_size,
 *     media_name,
 *     media_type,
 *     media_extension
 *   }
 * @returns {Promise<ProjectMedia>}
 */
async function createProjectMedia(data) {
  const media = await ProjectMedia.create(data);
  return media;
}

/**
 * Retrieves all media records for a given project (if needed).
 * @param {number} projectId - The project ID.
 * @returns {Promise<Array<ProjectMedia>>}
 */
async function getMediaByProjectId(projectId) {
  const mediaList = await ProjectMedia.findAll({
    where: { project_id: projectId },
    order: [["createdAt", "DESC"]],
  });
  return mediaList;
}

/**
 * Retrieves a single ProjectMedia record by its ID.
 * @param {number} id - The media ID.
 * @returns {Promise<ProjectMedia|null>}
 */
async function getMediaById(id) {
  const media = await ProjectMedia.findByPk(id);
  return media;
}

/**
 * Updates a ProjectMedia record by its ID.
 * @param {number} id - The media ID.
 * @param {Object} data - Fields to update.
 * @returns {Promise<ProjectMedia|null>}
 */
async function updateProjectMedia(id, data) {
  const media = await ProjectMedia.findByPk(id);
  if (!media) {
    return null;
  }
  await media.update(data);
  return media;
}

/**
 * Deletes a ProjectMedia record by its ID.
 * @param {number} id - The media ID.
 * @returns {Promise<boolean>} - True if deletion succeeded, false if not found.
 */
async function deleteProjectMedia(id) {
  const media = await ProjectMedia.findByPk(id);
  if (!media) {
    return false;
  }
  await media.destroy();
  return true;
}

module.exports = {
  createProjectMedia,
  getMediaByProjectId,
  getMediaById,
  updateProjectMedia,
  deleteProjectMedia,
};

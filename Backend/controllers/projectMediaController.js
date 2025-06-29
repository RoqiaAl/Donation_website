"use strict";
const path = require("path");
const {
  createProjectMedia,
  getMediaByProjectId,
  getMediaById,
  updateProjectMedia,
  deleteProjectMedia,
} = require("../services/projectMediaService");

/**
 * Controller to create a new media record for a project.
 * Expects multipart/form-data with:
 *   - project_id (required, numeric)
 *   - media_type (required, numeric, e.g. 1 for image, 2 for video)
 *   - mediaFiles (file) in the field "media" if using .array() or "mediaFile" if single
 */
async function createProjectMediaController(req, res) {
  try {
    // Validate required text fields
    if (!req.body.project_id) {
      return res
        .status(400)
        .json({ success: false, message: "project_id is required." });
    }
    if (!req.body.media_type) {
      return res
        .status(400)
        .json({ success: false, message: "media_type is required." });
    }
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "At least one file must be uploaded.",
        });
    }

    // Parse and validate project_id and media_type
    const projectId = parseInt(req.body.project_id, 10);
    if (isNaN(projectId)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "project_id must be a valid integer.",
        });
    }
    const mediaType = parseInt(req.body.media_type, 10);
    if (isNaN(mediaType)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "media_type must be a valid integer.",
        });
    }

    // Process each uploaded file and create a media record for each
    const mediaRecords = await Promise.all(
      req.files.map(async (file) => {
        const mediaUrl = `/projectMedia/${file.filename}`; // relative path
        const mediaSize = file.size;
        const mediaName = path.parse(file.originalname).name;
        const mediaExtension = path.extname(file.originalname);

        const data = {
          project_id: projectId,
          media_url: mediaUrl,
          media_size: mediaSize,
          media_name: mediaName,
          media_type: mediaType,
          media_extension: mediaExtension,
        };

        return await createProjectMedia(data);
      })
    );

    return res.status(201).json({ success: true, mediaRecords });
  } catch (error) {
    console.error("Error creating project media:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Controller to retrieve all media for a given project.
 * Expects projectId in req.params.
 */
async function getMediaByProjectController(req, res) {
  try {
    const { projectId } = req.params;
    // fetch full media records
    const mediaList = await getMediaByProjectId(projectId);

    // pluck out just the URL paths
    const media = mediaList.map((m) => m.media_url);

    return res.json({
      success: true,
      media, // e.g. [ "/projectMedia/123.png", "/projectMedia/456.jpg", … ]
    });
  } catch (error) {
    console.error("Error fetching media:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Controller to retrieve a single media record by ID.
 */
async function getMediaByIdController(req, res) {
  try {
    const { id } = req.params;
    const media = await getMediaById(id);
    if (!media) {
      return res
        .status(404)
        .json({ success: false, message: "Media not found." });
    }
    return res.json({ success: true, media });
  } catch (error) {
    console.error("Error fetching media by ID:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Controller to update an existing media record.
 * Expects multipart/form-data. The "mediaFile" field is optional.
 */
async function updateProjectMediaController(req, res) {
  try {
    const { id } = req.params;
    const data = {
      project_id: req.body.project_id
        ? parseInt(req.body.project_id, 10)
        : undefined,
      media_type: req.body.media_type
        ? parseInt(req.body.media_type, 10)
        : undefined,
    };

    // If a new file is uploaded, update the relevant fields
    if (req.file) {
      data.media_url = `/projectMedia/${req.file.filename}`;
      data.media_size = req.file.size;
      data.media_name = path.parse(req.file.originalname).name;
      data.media_extension = path.extname(req.file.originalname);
    }

    const updatedMedia = await updateProjectMedia(id, data);
    if (!updatedMedia) {
      return res
        .status(404)
        .json({ success: false, message: "Media not found." });
    }
    return res.json({ success: true, media: updatedMedia });
  } catch (error) {
    console.error("Error updating project media:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Controller to delete a media record by ID.
 */
async function deleteProjectMediaController(req, res) {
  try {
    const { id } = req.params;
    const success = await deleteProjectMedia(id);
    if (!success) {
      return res
        .status(404)
        .json({ success: false, message: "Media not found." });
    }
    return res.json({ success: true, message: "Media deleted successfully." });
  } catch (error) {
    console.error("Error deleting project media:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  createProjectMediaController,
  getMediaByProjectController,
  getMediaByIdController,
  updateProjectMediaController,
  deleteProjectMediaController,
};

"use strict";
const express = require("express");
const router = express.Router();
const getUploadMiddleware = require("../utils/uploadMediaMiddleware");

// Configure a single middleware instance that accepts both images and videos.
// This middleware will accept up to 5 files under the key "mediaFiles".
const uploadMultiple = getUploadMiddleware("projectMedia", {
  allowedMimes: ["image/jpeg", "image/png", "video/mp4", "video/ogg"],
  maxFileSize: 100 * 1024 * 1024, // 100 MB
}).array("media", 5);

const {
  createProjectMediaController,
  getMediaByProjectController,
  getMediaByIdController,
  updateProjectMediaController,
  deleteProjectMediaController,
} = require("../controllers/projectMediaController");

/**
 * POST /api/project-media
 * Single endpoint that handles both images and videos.
 * Expects multipart/form-data with:
 *   - Text fields: project_id, media_type
 *   - Files: up to 5 files under the key "media"
 */
router.post("/", uploadMultiple, createProjectMediaController);

// Retrieve media by project ID
router.get("/project/:projectId", getMediaByProjectController);

// Retrieve a single media record by ID
router.get("/:id", getMediaByIdController);

// Update a media record (uses single file upload for update)
router.put(
  "/:id",
  getUploadMiddleware("projectMedia", {
    allowedMimes: ["image/jpeg", "image/png", "video/mp4", "video/ogg"],
    maxFileSize: 100 * 1024 * 1024,
  }).single("mediaFile"),
  updateProjectMediaController
);

// Delete a media record by ID
router.delete("/:id", deleteProjectMediaController);

module.exports = router;

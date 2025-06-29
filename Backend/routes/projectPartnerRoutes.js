"use strict";
const express = require("express");
const router = express.Router();

// If you need to upload files for project partner (e.g., partner logos specific to a project), you could use the upload middleware.
// Otherwise, if no file upload is required for the join record, omit the upload middleware.
const {
  createProjectPartnerController,
  deleteProjectPartnerController,
  listPartnersByProject
} = require("../controllers/projectPartnerController");

// Create a new project-partner association
router.post("/", createProjectPartnerController);

// Delete an association by ID
router.delete("/:id", deleteProjectPartnerController);
router.get("/project/:projectId", listPartnersByProject);

module.exports = router;

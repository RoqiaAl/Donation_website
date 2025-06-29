// routes/projectRoutes.js
"use strict";

const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

// Create a new project
// POST /projects
router.post("/", projectController.create);

// Retrieve all projects
// GET /projects
router.get("/", projectController.getAll);

router.put("/:id", projectController.updateProject);

// Retrieve a project by ID
// GET /projects/:id
router.get("/:id", projectController.getById);

// Delete a project
// DELETE /projects/:id
router.delete("/:id", projectController.deleteProject);

module.exports = router;

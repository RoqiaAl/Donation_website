// routes/storyRoutes.js
"use strict";

const express = require("express");
const router = express.Router();

const {
  createStoryController,
  getAllStoriesController,
  getApprovedStoriesController,   // <-- make sure you export this
  getStoryByIdController,
  updateStoryController,
  changeStoryStatusController,
  deleteStoryController,
  uploadStoryImageController,
} = require("../controllers/storyController");

const getUploadMiddleware = require("../utils/uploadMiddleware");
const storyUpload = getUploadMiddleware("story-images");

// 1️⃣ Create (with optional image)
router.post("/", storyUpload.single("image"), createStoryController);

// 2️⃣ List all
router.get("/", getAllStoriesController);

// 2b️⃣ List approved only
router.get("/approved", getApprovedStoriesController);

// 5️⃣ Get by ID
router.get("/:id", getStoryByIdController);

// 3️⃣ Update (with optional new image)
router.put("/:id", storyUpload.single("image"), updateStoryController);

// 4️⃣ Change status
router.patch("/:id/status", changeStoryStatusController);

// 📸 Upload/replace image only
router.post("/:id/image", storyUpload.single("image"), uploadStoryImageController);

// 6️⃣ Delete
router.delete("/:id", deleteStoryController);

module.exports = router;

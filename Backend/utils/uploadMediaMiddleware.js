// middlewares/uploadMiddleware.js
"use strict";
const multer = require("multer");
const path = require("path");

/**
 * Returns a configured multer instance for handling file uploads.
 * @param {string} folderName - The subfolder in `public` where files will be stored.
 * @param {Object} options - { allowedMimes: string[], maxFileSize: number }
 */
function getUploadMiddleware(folderName, options = {}) {
  const defaultOptions = {
    allowedMimes: ["image/jpeg", "image/png", "video/mp4", "video/ogg"],
    maxFileSize: 50 * 1024 * 1024, // 50 MB default
  };
  const config = { ...defaultOptions, ...options };

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../public", folderName));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    if (config.allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed: ${config.allowedMimes.join(", ")}`
        ),
        false
      );
    }
  };

  return multer({
    storage,
    limits: { fileSize: config.maxFileSize },
    fileFilter,
  });
}

module.exports = getUploadMiddleware;

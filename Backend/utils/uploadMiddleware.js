// uploadMiddleware.js
const multer = require("multer");
const path = require("path");

/**
 * Returns a multer middleware configured to save uploaded files
 * to a specific folder inside the public directory.
 *
 * @param {string} folderName - The folder inside "public" where files should be stored.
 * @returns {multer} - The configured multer instance.
 */
function getUploadMiddleware(folderName) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Files will be stored in "public/<folderName>"
      cb(null, path.join(__dirname, "../public", folderName));
    },
    filename: (req, file, cb) => {
      // Generate a unique filename with the original file extension
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  // Create the multer upload instance with a 2MB file size limit and allowed MIME types
  const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter: (req, file, cb) => {
      // Accept only JPEG and PNG files
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
      } else {
        cb(new Error("Only JPEG and PNG images are allowed."), false);
      }
    },
  });

  return upload;
}

module.exports = getUploadMiddleware;

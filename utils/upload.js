const multer = require("multer");
const dotenv = require("dotenv");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const folder =
      file.fieldname === "avatar"
        ? "ozomata_project/avatars"
        : file.fieldname === "image"
        ? "ozomata_project/images"
        : "default";

    return {
      folder: folder,
      allowed_formats: ["jpeg", "jpg", "png", "gif", "webp"],
      resource_type: "image",
    };
  },
});

// Multer configuration
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10MB max file size
  fileFilter(req, file, cb) {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Invalid file type");
      error.code = "LIMIT_FILE_TYPE";
      return cb(error);
    }

    cb(null, true);
  },
}).fields([
  { name: "avatar", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

// Middleware to handle upload errors and pass control
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error", err);
      return res.status(400).json({
        message: "File upload error",
        error: err.message,
      });
    } else if (err) {
      console.error("Unknown upload error", err);
      return res.status(500).json({
        message: "File upload error",
        error: err.message,
      });
    }

    next();
  });
};

module.exports = uploadMiddleware;

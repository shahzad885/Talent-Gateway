// backend/routes/upload.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  authenticateUser,
  authorizeRoles,
  isOwnerOrAdmin,
} = require("../middleware/authMiddleware");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename and replace spaces with underscores
    const uniqueFilename = `${Date.now()}-${file.originalname.replace(
      /\s/g,
      "_"
    )}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|zip/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, DOC, DOCX, and ZIP files are allowed."
        )
      );
    }
  },
});

// Upload single file route (keep for backward compatibility)
router.post("/upload", authenticateUser, upload.single("file"), (req, res) => {
  console.log("Single file upload:", req.file); // Log the file information for debugging
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ url: fileUrl });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Upload multiple files route
router.post(
  "/upload/multi",
  authenticateUser,
  upload.array("files", 5),
  (req, res) => {
    console.log("Multiple files upload:", req.files); // Log the files information for debugging
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      // Create URLs for all uploaded files
      const fileUrls = req.files.map((file) => `/uploads/${file.filename}`);

      res.status(200).json({
        message: "Files uploaded successfully",
        fileUrls: fileUrls,
        files: req.files.map((file) => ({
          originalName: file.originalname,
          filename: file.filename,
          size: file.size,
          mimetype: file.mimetype,
        })),
      });
    } catch (error) {
      console.error("File upload error:", error);
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;

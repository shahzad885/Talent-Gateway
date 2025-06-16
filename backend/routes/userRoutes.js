// backend/routes/userRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/profiles";
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create unique filename with user ID and timestamp
    const uniqueName = `profile-${req.user.id}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Helper function to delete old profile image
const deleteOldProfileImage = (imageUrl) => {
  if (imageUrl && !imageUrl.includes("avatar.iran.liara.run")) {
    const filename = path.basename(imageUrl);
    const filePath = path.join("uploads/profiles", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

router.get("/profile", authenticateUser, async (req, res) => {
  try {
    console.log("Profile request - User ID:", req.user.id);
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User found:", user.email);
    res.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/update", authenticateUser, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// New route for profile image upload
router.post(
  "/upload-profile-image",
  authenticateUser,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // Get current user to access old profile image
      const currentUser = await User.findById(req.user.id);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Delete old profile image if it exists and it's not the default
      deleteOldProfileImage(currentUser.profileImageURL);

      // Create the new profile image URL
      const profileImageURL = `${req.protocol}://${req.get(
        "host"
      )}/uploads/profiles/${req.file.filename}`;

      // Update user with new profile image URL
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { profileImageURL },
        { new: true }
      );

      res.json({
        message: "Profile image uploaded successfully",
        profileImageURL: updatedUser.profileImageURL,
        user: updatedUser,
      });
    } catch (error) {
      console.error("Profile image upload error:", error);

      // Clean up uploaded file if there was an error
      if (req.file) {
        const filePath = req.file.path;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      if (error.message.includes("Only image files are allowed")) {
        return res.status(400).json({ message: error.message });
      }

      res.status(500).json({ message: "Server error during image upload" });
    }
  }
);

// Route to delete profile image
router.delete("/delete-profile-image", authenticateUser, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete current profile image file
    deleteOldProfileImage(currentUser.profileImageURL);

    // Reset to default profile image
    const defaultImageURL = "https://avatar.iran.liara.run/public";
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profileImageURL: defaultImageURL },
      { new: true }
    );

    res.json({
      message: "Profile image deleted successfully",
      profileImageURL: updatedUser.profileImageURL,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile image delete error:", error);
    res.status(500).json({ message: "Server error during image deletion" });
  }
});

module.exports = router;

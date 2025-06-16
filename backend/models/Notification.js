// backend/models/Notification.js
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "application_status",
        "new_application",
        "new_project",
        "new_internship",
        "project_submission",
        "message",
        "profile_update",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    relatedItem: {
      itemId: mongoose.Schema.Types.ObjectId,
      itemType: String, // "Project", "Internship", "Application", "Message", etc.
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);

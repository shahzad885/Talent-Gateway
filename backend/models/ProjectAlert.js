// backend/models/ProjectAlert.js
const mongoose = require("mongoose");

const ProjectAlertSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    keywords: [String], // Skills or topics student is interested in
    categories: [String], // Project categories of interest
    notificationFrequency: {
      type: String,
      enum: ["immediate", "daily", "weekly"],
      default: "immediate",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProjectAlert", ProjectAlertSchema);

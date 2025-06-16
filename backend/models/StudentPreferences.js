// backend/models/StudentPreferences.js
const mongoose = require("mongoose");

const StudentPreferencesSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    preferredProjectTypes: [String],
    preferredIndustries: [String],
    preferredLocations: [String],
    remotePreference: {
      type: String,
      enum: ["remote_only", "onsite_only", "hybrid", "no_preference"],
      default: "no_preference",
    },
    minimumStipend: Number,
    availabilityHours: Number, // Hours per week
    projectDurationPreference: {
      type: String,
      enum: ["short_term", "medium_term", "long_term", "no_preference"],
      default: "no_preference",
    },
    notificationSettings: {
      email: {
        projectAlerts: { type: Boolean, default: true },
        applicationUpdates: { type: Boolean, default: true },
        messages: { type: Boolean, default: true },
      },
      inApp: {
        projectAlerts: { type: Boolean, default: true },
        applicationUpdates: { type: Boolean, default: true },
        messages: { type: Boolean, default: true },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentPreferences", StudentPreferencesSchema);

// backend/models/Application.js
const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "opportunityType",
      required: true,
    },
    opportunityType: {
      type: String,
      enum: ["Project", "Internship"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    coverLetter: String,
    resume: String, // URL to resume file
    submissionDate: { type: Date, default: Date.now },
    feedback: String, // Feedback from alumni
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);

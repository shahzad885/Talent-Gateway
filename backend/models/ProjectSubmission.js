// backend/models/ProjectSubmission.js
const mongoose = require("mongoose");

const ProjectSubmissionSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    zipFile: { type: String, required: true }, // URL to the zip file
    description: String,
    submissionDate: { type: Date, default: Date.now },
    feedback: String,
    status: {
      type: String,
      enum: ["Submitted", "Reviewed", "Accepted", "Rejected"],
      default: "Submitted",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProjectSubmission", ProjectSubmissionSchema);

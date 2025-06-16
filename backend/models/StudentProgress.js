// backend/models/StudentProgress.js
const mongoose = require("mongoose");

const StudentProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    milestones: [
      {
        title: String,
        description: String,
        dueDate: Date,
        completedDate: Date,
        status: {
          type: String,
          enum: ["pending", "in_progress", "completed", "overdue"],
          default: "pending",
        },
        feedback: String,
      },
    ],
    currentProgress: {
      type: Number, // Percentage of completion
      default: 0,
    },
    startDate: Date,
    expectedEndDate: Date,
    actualEndDate: Date,
    notes: String,
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentProgress", StudentProgressSchema);

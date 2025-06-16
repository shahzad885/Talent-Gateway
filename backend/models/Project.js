// backend/models/Project.js
const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    duration: { type: String, required: true }, // e.g., "2 months", "6 weeks"
    skills: [String],
    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alumni",
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Occupied", "Completed"],
      default: "Open",
    },
    createdAt: { type: Date, default: Date.now },
    deadline: Date,
    compensation: { type: String, default: "Unpaid" }, // e.g., "Paid", "Unpaid", "Certificate"
    documents: [String], // URLs to any supporting documents
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);

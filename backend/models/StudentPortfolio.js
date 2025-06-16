// backend/models/StudentPortfolio.js
const mongoose = require("mongoose");

const ProjectEntrySchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  title: String,
  description: String,
  skills: [String],
  images: [String], // URLs to project images
  demoLink: String,
  githubLink: String,
  startDate: Date,
  endDate: Date,
  isPublic: {
    type: Boolean,
    default: true,
  },
});

const StudentPortfolioSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    projects: [ProjectEntrySchema],
    bio: String,
    resumeUrl: String,
    socialLinks: {
      linkedin: String,
      github: String,
      website: String,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentPortfolio", StudentPortfolioSchema);

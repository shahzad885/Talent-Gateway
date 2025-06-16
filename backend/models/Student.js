// backend/models/Student.js
const User = require("./User");
const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  semester: Number,
  degreePrograms: [String],
  skills: [String],
  completedProjects: [String],
  university: String,
  graduationYear: String,
  degree: String, // Already in User schema, but can override here if specific to student
  major: String, // Added for StudentProfile
  resumeUrl: String, // Added for StudentProfile
  linkedinUrl: String, // Added for StudentProfile
  githubUrl: String, // Added for StudentProfile
});

module.exports = User.discriminator("Student", StudentSchema);

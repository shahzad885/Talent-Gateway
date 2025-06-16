// backend/models/Alumni.js
const mongoose = require("mongoose");
const User = require("./User"); // Import the User model

const AlumniSchema = new mongoose.Schema({
  passoutYear: Number,
  degree: String,
  currentJobTitle: String,
  company: String,
  industry: String,
  skills: [String],
  expertise: [String],
});

module.exports = User.discriminator("Alumni", AlumniSchema);

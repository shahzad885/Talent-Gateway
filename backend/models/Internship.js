// backend/models/Internship.js
const mongoose = require("mongoose");

const InternshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    location: String,
    isRemote: { type: Boolean, default: false },
    duration: { type: String, required: true }, // e.g., "3 months", "Summer 2025"
    stipend: String, // e.g., "$1000/month", "Unpaid"
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
    deadline: Date,
    startDate: Date,
    skills: [String],
    applicationCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Internship", InternshipSchema);

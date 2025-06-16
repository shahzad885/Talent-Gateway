// backend/models/Chat.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const ChatSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    messages: [MessageSchema],
    lastMessage: { type: Date, default: Date.now },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, // Optional project reference
    internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" }, // Optional internship reference
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);

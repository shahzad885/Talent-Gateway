const mongoose = require("mongoose");

const CallSchema = new mongoose.Schema(
  {
    caller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "answered", "rejected", "ended", "missed"],
      default: "pending",
    },
    callType: {
      type: String,
      enum: ["video", "audio"],
      default: "video",
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: Date,
    duration: Number, // in seconds
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Call", CallSchema);

// backend/routes/callRoutes.js
const express = require("express");
const router = express.Router();
const Call = require("../models/Call");
const User = require("../models/User");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Get call history
router.get("/history", authenticateUser, async (req, res) => {
  try {
    const calls = await Call.find({
      $or: [{ caller: req.user._id }, { receiver: req.user._id }],
    })
      .populate("caller", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(calls);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get online users for calling
router.get("/online-users", authenticateUser, async (req, res) => {
  try {
    const currentUser = req.user;
    const oppositeRole = currentUser.role === "student" ? "alumni" : "student";

    // Get users of opposite role
    const users = await User.find({
      role: oppositeRole,
      _id: { $ne: currentUser._id },
    }).select("name role company university isOnline");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Initiate a call
router.post("/initiate", authenticateUser, async (req, res) => {
  try {
    const { receiverId, callType = "video" } = req.body;

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create call record
    const call = new Call({
      caller: req.user._id,
      receiver: receiverId,
      callType,
      status: "pending",
    });

    const savedCall = await call.save();
    console.log("Saved call:", savedCall); // Debug log

    // Use Call.findById with populate instead of call.populate
    const populatedCall = await Call.findById(savedCall._id)
      .populate("caller", "name role")
      .populate("receiver", "name role");

    console.log("Populated call:", populatedCall); // Debug log

    res.status(201).json(populatedCall);
  } catch (error) {
    console.error("Error in /initiate:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update call status
router.patch("/:callId/status", authenticateUser, async (req, res) => {
  try {
    const { status, endTime, duration } = req.body;
    const callId = req.params.callId;

    const call = await Call.findById(callId);
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    // Check if user is participant in the call
    if (
      call.caller.toString() !== req.user._id.toString() &&
      call.receiver.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update the call
    const updatedCall = await Call.findByIdAndUpdate(
      callId,
      {
        status,
        ...(endTime && { endTime }),
        ...(duration && { duration }),
      },
      { new: true }
    )
      .populate("caller", "name role")
      .populate("receiver", "name role");

    console.log("Updated call:", updatedCall); // Debug log

    res.json(updatedCall);
  } catch (error) {
    console.error("Error in /status update:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Add this route to your callRoutes.js file

// GET /api/calls/:callId - Get call details by ID
router.get("/:callId", async (req, res) => {
  try {
    const call = await Call.findById(req.params.callId)
      .populate("caller", "name email role company university")
      .populate("receiver", "name email role company university");

    if (!call) {
      return res.status(404).json({ error: "Call not found" });
    }

    res.json(call);
  } catch (error) {
    console.error("Error fetching call:", error);
    res.status(500).json({ error: "Failed to fetch call details" });
  }
});

module.exports = router;

// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const alumniRoutes = require("./routes/alumniRoutes");
const studentRoutes = require("./routes/studentRoutes");
const uploadRoutes = require("./routes/upload");
const callRoutes = require("./routes/callRoutes");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/student", studentRoutes);
app.use("/api", uploadRoutes);
app.use("/api/calls", callRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "https://192.168.100.25:5173/", // Allow your frontend to connect
    methods: ["GET", "POST"],
  },
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  // User joins with their user ID
  socket.on("user_join", (userId) => {
    socket.userId = userId;
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });
  // Handle user joining a specific chat room
  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat: ${chatId}`);
  });

  // Handle sending messages
  socket.on("send_message", (messageData) => {
    // Broadcast to everyone in the room except sender
    socket.to(messageData.chatId).emit("receive_message", messageData);
  });

  // Handle read receipts
  socket.on("mark_read", (data) => {
    socket.to(data.chatId).emit("messages_read", {
      chatId: data.chatId,
      userId: data.userId,
    });
  });
  // VIDEO CALLING EVENTS
  socket.on("initiateCall", ({ userId, signalData, myId }) => {
    console.log(`Call initiated from ${myId} to ${userId}`);
    io.to(userId).emit("incomingCall", { signalData, from: myId });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("endCall", ({ to }) => {
    io.to(to).emit("callEnded");
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);

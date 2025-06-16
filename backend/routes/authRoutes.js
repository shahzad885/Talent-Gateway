// backend/routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");
const Alumni = require("../models/Alumni");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, contactInfo, role } = req.body;
    console.log("Received signup data:", req.body); // Debugging line
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const isFirstUser = (await User.countDocuments()) === 0;
    const userRole = isFirstUser ? "admin" : role;

    let newUser;
    if (userRole === "student") {
      // Create a Student instance with student-specific fields
      newUser = new Student({
        name,
        email,
        password,
        contactInfo,
        role: userRole,
      });
    } else if (userRole === "alumni") {
      // Create an Alumni instance with alumni-specific fields
      newUser = new Alumni({
        name,
        email,
        password,
        contactInfo,
        role: userRole,
      });
    } else {
      // Create a base User instance for "admin" or other roles
      newUser = new User({
        name,
        email,
        password,
        contactInfo,
        role: userRole,
      });
    }

    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Change "id" to "userId"
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

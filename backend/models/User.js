// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profileImageURL: {
    type: String,
    default: "https://avatar.iran.liara.run/public",
  },
  contactInfo: String,
  bio: String,
  role: { type: String, enum: ["admin", "student", "alumni"] },
  isProfilePublic: { type: Boolean, default: true },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", UserSchema);

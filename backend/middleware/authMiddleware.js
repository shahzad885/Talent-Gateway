const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid authentication" });
    }

    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Authentication failed", error: error.message });
  }
};

// Role-based authorization middleware
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role (${req.user.role}) is not authorized to access this resource`,
      });
    }
    next();
  };
};

// Middleware to check if user owns a resource or is an admin
exports.isOwnerOrAdmin = (model) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const resource = await model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      // Check if user is admin or the owner of the resource
      const isAdmin = req.user.role === "admin";
      const isOwner =
        resource.alumni &&
        resource.alumni.toString() === req.user._id.toString();

      if (!isAdmin && !isOwner) {
        return res
          .status(403)
          .json({ message: "Not authorized to access this resource" });
      }

      req.resource = resource;
      next();
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
};

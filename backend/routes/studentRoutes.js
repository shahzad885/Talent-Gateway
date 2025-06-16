// backend/routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");
const Project = require("../models/Project");
const Internship = require("../models/Internship");
const Application = require("../models/Application");
const ProjectSubmission = require("../models/ProjectSubmission");
const ProjectAlert = require("../models/ProjectAlert");
const StudentProgress = require("../models/StudentProgress");
const StudentPortfolio = require("../models/StudentPortfolio");
const Chat = require("../models/Chat");
const StudentPreferences = require("../models/StudentPreferences");
const Notification = require("../models/Notification");
const Student = require("../models/Student");
const User = require("../models/User");
const ConnectionRequest = require("../models/ConnectionRequest");
const Alumni = require("../models/Alumni");
// Middleware to check if student owns the application
const isApplicationOwner = async (req, res, next) => {
  try {
    const applicationId = req.params.id;
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.student.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this application" });
    }

    req.application = application;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update student profile
router.put(
  "/profile",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const {
        name,
        email, // Optional: might be read-only in frontend, but included for flexibility
        bio,
        university,
        graduationYear,
        degree,
        major,
        skills,
        resumeUrl,
        linkedinUrl,
        githubUrl,
        phoneNumber,
      } = req.body;

      // Update the student profile
      const updatedStudent = await Student.findByIdAndUpdate(
        req.user._id, // Assumes req.user is set by authenticateUser middleware
        {
          name,
          email, // If you allow email updates; otherwise, exclude this
          bio,
          contactInfo: phoneNumber, // Map phoneNumber to contactInfo in User schema
          university, // Add to Student schema if needed (see below)
          graduationYear, // Add to Student schema if needed
          degree, // Already in User schema
          major, // Add to Student schema if needed
          skills, // Already in Student schema
          resumeUrl, // Add to Student schema if needed
          linkedinUrl, // Add to Student schema if needed
          githubUrl, // Add to Student schema if needed
        },
        { new: true, runValidators: true }
      ).select("-password"); // Exclude password from response

      if (!updatedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json(updatedStudent);
    } catch (error) {
      console.error("Error updating student profile:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get specific alumni profile by ID for students
router.get(
  "/alumni/profile/:id",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const alumniId = req.params.id;

      // Find the alumni by ID, excluding the password field
      const alumni = await Alumni.findById(alumniId).select("-password");

      if (!alumni) {
        return res.status(404).json({ message: "Alumni not found" });
      }

      // Check if alumni profile is public
      if (!alumni.isProfilePublic) {
        // You could add a check here to see if they are connected
        // const isConnected = await checkIfConnected(req.user._id, alumniId);
        // if (!isConnected) {
        //   return res.status(403).json({ message: "This profile is private" });
        // }
        return res.status(403).json({ message: "This profile is private" });
      }

      res.status(200).json(alumni);
    } catch (error) {
      console.error("Error fetching alumni profile:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);
//Connection Request Routes

// Search for alumni
router.get(
  "/search",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const {
        name,
        skills,
        expertise,
        industry,
        company,
        passoutYear,
        degree,
        page = 1,
        limit = 10,
      } = req.query;

      // Build query
      const query = { role: "alumni", isProfilePublic: true };

      if (name) {
        query.name = { $regex: name, $options: "i" };
      }

      if (skills) {
        query.skills = { $in: skills.split(",").map((s) => s.trim()) };
      }

      if (expertise) {
        query.expertise = { $in: expertise.split(",").map((e) => e.trim()) };
      }

      if (industry) {
        query.industry = { $regex: industry, $options: "i" };
      }

      if (company) {
        query.company = { $regex: company, $options: "i" };
      }

      if (passoutYear) {
        query.passoutYear = parseInt(passoutYear);
      }

      if (degree) {
        query.degree = { $regex: degree, $options: "i" };
      }

      // Execute query with pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const alumni = await Alumni.find(query)
        .select("-password") // Exclude password
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ name: 1 });

      const total = await Alumni.countDocuments(query);

      // Get connection request status for each alumni
      const alumniWithConnectionStatus = await Promise.all(
        alumni.map(async (alum) => {
          const connectionRequest = await ConnectionRequest.findOne({
            $or: [
              { sender: req.user.id, receiver: alum._id },
              { sender: alum._id, receiver: req.user.id },
            ],
          }).sort({ createdAt: -1 });

          // Check if there's an existing chat
          const chat = await Chat.findOne({
            participants: { $all: [req.user.id, alum._id] },
          });

          const alumObj = alum.toObject();
          alumObj.connectionStatus = connectionRequest
            ? connectionRequest.status
            : "none";

          // If the connection is accepted and there's a chat, include the chat ID
          alumObj.chatId = chat ? chat._id : null;

          // Check if this request was sent by the current user
          if (connectionRequest) {
            alumObj.requestSentByMe =
              connectionRequest.sender.toString() === req.user.id;
          }

          return alumObj;
        })
      );

      res.json({
        alumni: alumniWithConnectionStatus,
        totalPages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
        total,
      });
    } catch (error) {
      console.error("Error searching alumni:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Send connection request
router.post(
  "/connection-request/:alumniId",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const alumniId = req.params.alumniId;
      const studentId = req.user.id;
      const { message } = req.body;

      // Check if alumni exists and has a public profile
      const alumni = await Alumni.findOne({
        _id: alumniId,
        role: "alumni",
        isProfilePublic: true,
      });

      if (!alumni) {
        return res.status(404).json({ message: "Alumni not found" });
      }

      // Check if there's already a pending or accepted connection request
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { sender: studentId, receiver: alumniId },
          { sender: alumniId, receiver: studentId },
        ],
        status: { $in: ["pending", "accepted"] },
      });

      if (existingRequest) {
        return res.status(400).json({
          message: `Connection request already ${existingRequest.status}`,
          status: existingRequest.status,
        });
      }

      // Create new connection request
      const connectionRequest = new ConnectionRequest({
        sender: studentId,
        receiver: alumniId,
        message: message || "",
      });

      await connectionRequest.save();

      res.status(201).json({
        message: "Connection request sent successfully",
        connectionRequest,
      });
    } catch (error) {
      console.error("Error sending connection request:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get connection requests for a student
router.get("/connection-requests", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const query = {
      $or: [{ sender: userId }, { receiver: userId }],
    };

    if (status) {
      query.status = status;
    }

    const connectionRequests = await ConnectionRequest.find(query)
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: -1 });

    res.json(connectionRequests);
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all available projects
router.get(
  "/projects",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const { skills, status, duration, compensation } = req.query;

      // Build filter object
      const filter = { status: "Open" };

      if (skills) {
        filter.skills = { $in: skills.split(",") };
      }

      if (duration) {
        filter.duration = duration;
      }

      if (compensation) {
        filter.compensation = compensation;
      }

      const projects = await Project.find(filter)
        .populate("alumni", "name email company")
        .sort({ createdAt: -1 });

      res.status(200).json(projects);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching projects", error: error.message });
    }
  }
);

// Get all available internships
router.get(
  "/internships",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const { location, isRemote, skills, stipend } = req.query;

      // Build filter object
      const filter = { status: "Open" };

      if (location) {
        filter.location = location;
      }

      if (isRemote !== undefined) {
        filter.isRemote = isRemote === "true";
      }

      if (skills) {
        filter.skills = { $in: skills.split(",") };
      }

      if (stipend) {
        filter.stipend = { $regex: stipend, $options: "i" };
      }

      const internships = await Internship.find(filter)
        .populate("alumni", "name email company")
        .sort({ createdAt: -1 });

      res.status(200).json(internships);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching internships", error: error.message });
    }
  }
);

// Get specific internship by ID
router.get(
  "/internships/:id",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const internshipId = req.params.id;

      // Find the internship by ID and populate alumni details
      const internship = await Internship.findById(internshipId)
        .populate({
          path: "alumni",
          select:
            "name email passoutYear degree currentJobTitle company industry skills expertise",
          model: "User", // Explicitly specify the model since it's a discriminator
        })
        .lean(); // Convert to plain JavaScript object

      if (!internship) {
        return res.status(404).json({
          success: false,
          message: "Internship not found",
        });
      }

      // Check if the student has already applied (optional)
      const hasApplied = await Application.findOne({
        student: req.user._id,
        opportunity: internshipId,
        opportunityType: "Internship",
      });

      // Prepare the response data
      res.status(200).json({
        success: true,
        data: {
          ...internship,
          hasApplied: !!hasApplied, // Boolean indicating if student has applied
        },
      });
    } catch (error) {
      console.error("Error fetching internship:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching internship",
        error: error.message,
      });
    }
  }
);

// Get specific project by ID
router.get(
  "/projects/:id",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const projectId = req.params.id;
      const project = await Project.findById(projectId)
        .populate({
          path: "alumni",
          select:
            "name email passoutYear degree currentJobTitle company industry skills expertise",
          model: "User",
        })
        .lean(); // Convert to plain JavaScript object
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }
      // Check if the student has already applied (optional)
      const hasApplied = await Application.findOne({
        student: req.user._id,
        opportunity: projectId,
        opportunityType: "Project",
      });

      // Prepare the response data
      res.status(200).json({
        success: true,
        data: {
          ...project,
          hasApplied: !!hasApplied, // Boolean indicating if student has applied
        },
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching project",
        error: error.message,
      });
    }
  }
);

//Get approved projects
router.get(
  "/approved-projects",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const applications = await Application.find({
        student: req.user._id,
        status: "Accepted",
        opportunityType: "Project",
      }).populate({
        path: "opportunity",
        model: "Project",
        populate: {
          path: "alumni",
          select: "name email",
        },
      });

      const projects = applications.map((app) => app.opportunity);
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get all submissions for the current student
router.get(
  "/submissions",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const submissions = await ProjectSubmission.find({
        student: req.user._id,
      })
        .select("project status")
        .lean();
      res.status(200).json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching submissions" });
    }
  }
);

// Get specific application by ID
router.get(
  "/applications/:id",
  authenticateUser,
  isApplicationOwner,
  async (req, res) => {
    try {
      const applicationId = req.params.id;
      const application = await Application.findById(applicationId).lean();

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }

      // Dynamically populate based on opportunityType
      const populatedApplication = await Application.findById(applicationId)
        .populate({
          path: "opportunity",
          select: "title description skills duration compensation",
          model: application.opportunityType, // Dynamically uses Project or Internship model
        })
        .populate({
          path: "student",
          select: "name email",
          model: "Student",
        })
        .lean();

      res.status(200).json({
        success: true,
        data: populatedApplication,
        message: "Application retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching application",
        error: error.message,
      });
    }
  }
);
// Apply for a project
router.post(
  "/apply/project/:id",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const { coverLetter, resume } = req.body;
      const projectId = req.params.id;

      // Check if project exists and is open
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.status !== "Open") {
        return res.status(400).json({
          message: "This project is no longer accepting applications",
        });
      }

      // Check if student has already applied
      const existingApplication = await Application.findOne({
        student: req.user._id,
        opportunity: projectId,
        opportunityType: "Project",
      });

      if (existingApplication) {
        return res
          .status(400)
          .json({ message: "You have already applied for this project" });
      }

      // Create new application
      const application = new Application({
        student: req.user._id,
        opportunity: projectId,
        opportunityType: "Project",
        coverLetter,
        resume,
        submissionDate: Date.now(),
      });

      await application.save();

      // Create notification for alumni
      const notification = new Notification({
        recipient: project.alumni,
        type: "new_application",
        title: "New Project Application",
        message: `${req.user.name} has applied for your project: ${project.title}`,
        relatedItem: {
          itemId: application._id,
          itemType: "Application",
        },
      });

      await notification.save();

      res.status(201).json({
        message: "Application submitted successfully",
        application,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error applying for project", error: error.message });
    }
  }
);

// Apply for an internship
router.post(
  "/apply/internship/:id",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const { coverLetter, resume } = req.body;
      const internshipId = req.params.id;

      // Check if internship exists and is open
      const internship = await Internship.findById(internshipId);
      if (!internship) {
        return res.status(404).json({ message: "Internship not found" });
      }

      if (internship.status !== "Open") {
        return res.status(400).json({
          message: "This internship is no longer accepting applications",
        });
      }

      // Check if student has already applied
      const existingApplication = await Application.findOne({
        student: req.user._id,
        opportunity: internshipId,
        opportunityType: "Internship",
      });

      if (existingApplication) {
        return res
          .status(400)
          .json({ message: "You have already applied for this internship" });
      }

      // Create new application
      const application = new Application({
        student: req.user._id,
        opportunity: internshipId,
        opportunityType: "Internship",
        coverLetter,
        resume,
        submissionDate: Date.now(),
      });

      await application.save();

      // Update application count
      internship.applicationCount += 1;
      await internship.save();

      // Create notification for alumni
      const notification = new Notification({
        recipient: internship.alumni,
        type: "new_application",
        title: "New Internship Application",
        message: `${req.user.name} has applied for your internship: ${internship.title}`,
        relatedItem: {
          itemId: application._id,
          itemType: "Application",
        },
      });

      await notification.save();

      res.status(201).json({
        message: "Application submitted successfully",
        application,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error applying for internship",
        error: error.message,
      });
    }
  }
);

// Get student's applications
router.get(
  "/applications",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const applications = await Application.find({ student: req.user._id })
        .populate({
          path: "opportunity",
          refPath: "opportunityType",
        })
        .sort({ submissionDate: -1 });

      res.status(200).json(applications);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching applications", error: error.message });
    }
  }
);

// Submit project work
router.post(
  "/submit-project/:projectId",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const { zipFile, description } = req.body;
      const projectId = req.params.projectId;

      // Verify the project exists
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Verify student is assigned to this project
      const application = await Application.findOne({
        student: req.user._id,
        opportunity: projectId,
        opportunityType: "Project",
        status: "Accepted",
      });
      if (!application) {
        return res
          .status(403)
          .json({ message: "You are not assigned to this project" });
      }

      // Create submission
      const submission = new ProjectSubmission({
        project: projectId,
        student: req.user._id,
        zipFile,
        description,
        submissionDate: Date.now(),
        status: "Submitted",
      });

      await submission.save();

      // Update project status
      project.status = "Completed";
      await project.save();

      // Create notification for alumni
      const notification = new Notification({
        recipient: project.alumni,
        type: "project_submission",
        title: "Project Submission Received",
        message: `${req.user.name} has submitted their work for your project: ${project.title}`,
        relatedItem: {
          itemId: submission._id,
          itemType: "ProjectSubmission",
        },
      });

      await notification.save();

      res.status(201).json({
        message: "Project submitted successfully",
        submission,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error submitting project", error: error.message });
    }
  }
);

// Create or update project alert preferences
router.post(
  "/project-alerts",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const { keywords, categories, notificationFrequency } = req.body;

      // Find existing alert or create new one
      let alert = await ProjectAlert.findOne({ student: req.user._id });

      if (alert) {
        // Update existing alert
        alert.keywords = keywords || alert.keywords;
        alert.categories = categories || alert.categories;
        alert.notificationFrequency =
          notificationFrequency || alert.notificationFrequency;
      } else {
        // Create new alert
        alert = new ProjectAlert({
          student: req.user._id,
          keywords,
          categories,
          notificationFrequency,
        });
      }

      await alert.save();

      res.status(200).json({
        message: "Project alert preferences updated successfully",
        alert,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating project alerts",
        error: error.message,
      });
    }
  }
);

// Update student progress for a project
router.post(
  "/progress/:projectId",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const { milestones, currentProgress, notes } = req.body;
      const projectId = req.params.projectId;

      // Verify project exists and student is assigned
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const application = await Application.findOne({
        student: req.user._id,
        opportunity: projectId,
        opportunityType: "Project",
        status: "Accepted",
      });

      if (!application) {
        return res
          .status(403)
          .json({ message: "You are not assigned to this project" });
      }

      // Find or create progress entry
      let progress = await StudentProgress.findOne({
        student: req.user._id,
        project: projectId,
      });

      if (progress) {
        // Update existing progress
        if (milestones) progress.milestones = milestones;
        if (currentProgress !== undefined)
          progress.currentProgress = currentProgress;
        if (notes) progress.notes = notes;
        progress.lastUpdated = Date.now();
      } else {
        // Create new progress entry
        progress = new StudentProgress({
          student: req.user._id,
          project: projectId,
          milestones: milestones || [],
          currentProgress: currentProgress || 0,
          notes: notes || "",
          startDate: Date.now(),
          expectedEndDate: project.deadline,
        });
      }

      await progress.save();

      // Notify alumni of progress update
      const notification = new Notification({
        recipient: project.alumni,
        type: "profile_update",
        title: "Project Progress Update",
        message: `${req.user.name} has updated their progress on project: ${project.title}`,
        relatedItem: {
          itemId: progress._id,
          itemType: "StudentProgress",
        },
      });

      await notification.save();

      res.status(200).json({
        message: "Progress updated successfully",
        progress,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating progress", error: error.message });
    }
  }
);

// Get or create student portfolio
router.get(
  "/portfolio",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      // Find existing portfolio or create new one
      let portfolio = await StudentPortfolio.findOne({ student: req.user._id });

      if (!portfolio) {
        portfolio = new StudentPortfolio({
          student: req.user._id,
          projects: [],
          bio: req.user.bio || "",
          socialLinks: {},
        });

        await portfolio.save();
      }

      res.status(200).json(portfolio);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching portfolio", error: error.message });
    }
  }
);

// Update student portfolio
router.put(
  "/portfolio",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const { bio, resumeUrl, socialLinks, isPublic } = req.body;

      // Find or create portfolio
      let portfolio = await StudentPortfolio.findOne({ student: req.user._id });

      if (!portfolio) {
        portfolio = new StudentPortfolio({
          student: req.user._id,
          projects: [],
          bio: bio || "",
          resumeUrl: resumeUrl || "",
          socialLinks: socialLinks || {},
          isPublic: isPublic !== undefined ? isPublic : true,
        });
      } else {
        // Update fields
        if (bio !== undefined) portfolio.bio = bio;
        if (resumeUrl !== undefined) portfolio.resumeUrl = resumeUrl;
        if (socialLinks !== undefined) portfolio.socialLinks = socialLinks;
        if (isPublic !== undefined) portfolio.isPublic = isPublic;
      }

      await portfolio.save();

      res.status(200).json({
        message: "Portfolio updated successfully",
        portfolio,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating portfolio", error: error.message });
    }
  }
);

// Add project to portfolio
router.post(
  "/portfolio/projects",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const {
        projectId,
        title,
        description,
        skills,
        images,
        demoLink,
        githubLink,
        startDate,
        endDate,
        isPublic,
      } = req.body;

      // Find portfolio
      let portfolio = await StudentPortfolio.findOne({ student: req.user._id });

      if (!portfolio) {
        portfolio = new StudentPortfolio({
          student: req.user._id,
          projects: [],
          bio: req.user.bio || "",
          socialLinks: {},
        });
      }

      // Create project entry
      const projectEntry = {
        project: projectId || null,
        title,
        description,
        skills: skills || [],
        images: images || [],
        demoLink: demoLink || "",
        githubLink: githubLink || "",
        startDate: startDate || new Date(),
        endDate: endDate || null,
        isPublic: isPublic !== undefined ? isPublic : true,
      };

      portfolio.projects.push(projectEntry);
      await portfolio.save();

      res.status(201).json({
        message: "Project added to portfolio successfully",
        project: projectEntry,
        portfolio,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error adding project to portfolio",
        error: error.message,
      });
    }
  }
);

// Create or start a chat with an alumni
router.post(
  "/chat-with-alumni/:alumniId",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const alumniId = req.params.alumniId;
      const { initialMessage, projectId, internshipId } = req.body;

      // Check if chat already exists
      let chat = await Chat.findOne({
        participants: { $all: [req.user._id, alumniId] },
      });

      if (!chat) {
        // Create new chat
        chat = new Chat({
          participants: [req.user._id, alumniId],
          messages: [],
          project: projectId || null,
          internship: internshipId || null,
        });
      }

      // Add initial message if provided
      if (initialMessage) {
        chat.messages.push({
          sender: req.user._id,
          content: initialMessage,
          timestamp: Date.now(),
          read: false,
        });

        chat.lastMessage = Date.now();
      }

      await chat.save();

      // Create notification for alumni
      const notification = new Notification({
        recipient: alumniId,
        type: "message",
        title: "New Message",
        message: `${req.user.name} has sent you a message`,
        relatedItem: {
          itemId: chat._id,
          itemType: "Chat",
        },
      });

      await notification.save();

      res.status(201).json({
        message: "Chat started successfully",
        chat,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error starting chat", error: error.message });
    }
  }
);

// Get student's chat list
router.get(
  "/chats",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const chats = await Chat.find({
        participants: req.user._id,
      })
        .populate("participants", "name email role")
        .populate("project", "title")
        .populate("internship", "title")
        .sort({ lastMessage: -1 });

      res.status(200).json(chats);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching chats", error: error.message });
    }
  }
);

// Send message in a chat
router.post(
  "/chats/:chatId/messages",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const chatId = req.params.chatId;
      const { content } = req.body;

      // Find chat and verify student is a participant
      const chat = await Chat.findById(chatId);

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      if (!chat.participants.includes(req.user._id)) {
        return res
          .status(403)
          .json({ message: "You are not a participant in this chat" });
      }

      // Add message
      const message = {
        sender: req.user._id,
        content,
        timestamp: Date.now(),
        read: false,
      };

      chat.messages.push(message);
      chat.lastMessage = Date.now();

      await chat.save();

      // Find other participant
      const otherParticipant = chat.participants.find(
        (participant) => participant.toString() !== req.user._id.toString()
      );

      // Create notification for other participant
      const notification = new Notification({
        recipient: otherParticipant,
        type: "message",
        title: "New Message",
        message: `${req.user.name} has sent you a message`,
        relatedItem: {
          itemId: chat._id,
          itemType: "Chat",
        },
      });

      await notification.save();

      res.status(201).json({
        message: "Message sent successfully",
        chat,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error sending message", error: error.message });
    }
  }
);

// Get student notifications
router.get(
  "/notifications",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const notifications = await Notification.find({
        recipient: req.user._id,
      }).sort({ createdAt: -1 });

      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching notifications",
        error: error.message,
      });
    }
  }
);

// Mark notification as read
router.put(
  "/notifications/:id/read",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const notificationId = req.params.id;

      const notification = await Notification.findOne({
        _id: notificationId,
        recipient: req.user._id,
      });

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      notification.read = true;
      await notification.save();

      res.status(200).json({
        message: "Notification marked as read",
        notification,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating notification", error: error.message });
    }
  }
);

// Update student preferences
router.post(
  "/preferences",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const {
        preferredProjectTypes,
        preferredIndustries,
        preferredLocations,
        remotePreference,
        minimumStipend,
        availabilityHours,
        projectDurationPreference,
        notificationSettings,
      } = req.body;

      // Find or create preferences
      let preferences = await StudentPreferences.findOne({
        student: req.user._id,
      });

      if (!preferences) {
        preferences = new StudentPreferences({
          student: req.user._id,
          preferredProjectTypes: preferredProjectTypes || [],
          preferredIndustries: preferredIndustries || [],
          preferredLocations: preferredLocations || [],
          remotePreference: remotePreference || "no_preference",
          minimumStipend: minimumStipend || 0,
          availabilityHours: availabilityHours || 20,
          projectDurationPreference:
            projectDurationPreference || "no_preference",
          notificationSettings: notificationSettings || {
            email: {
              projectAlerts: true,
              applicationUpdates: true,
              messages: true,
            },
            inApp: {
              projectAlerts: true,
              applicationUpdates: true,
              messages: true,
            },
          },
        });
      } else {
        // Update fields
        if (preferredProjectTypes)
          preferences.preferredProjectTypes = preferredProjectTypes;
        if (preferredIndustries)
          preferences.preferredIndustries = preferredIndustries;
        if (preferredLocations)
          preferences.preferredLocations = preferredLocations;
        if (remotePreference) preferences.remotePreference = remotePreference;
        if (minimumStipend !== undefined)
          preferences.minimumStipend = minimumStipend;
        if (availabilityHours !== undefined)
          preferences.availabilityHours = availabilityHours;
        if (projectDurationPreference)
          preferences.projectDurationPreference = projectDurationPreference;
        if (notificationSettings) {
          preferences.notificationSettings = {
            ...preferences.notificationSettings,
            ...notificationSettings,
          };
        }
      }

      await preferences.save();

      res.status(200).json({
        message: "Preferences updated successfully",
        preferences,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating preferences", error: error.message });
    }
  }
);
// Mark messages as read in a chat
router.post(
  "/chats/:chatId/read",
  authenticateUser,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const chatId = req.params.chatId;

      // Find chat and verify student is a participant
      const chat = await Chat.findById(chatId);

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      if (!chat.participants.includes(req.user._id)) {
        return res
          .status(403)
          .json({ message: "You are not a participant in this chat" });
      }

      // Find the other participant's ID (the one who is not the current user)
      const otherParticipantId = chat.participants.find(
        (participant) => participant.toString() !== req.user._id.toString()
      );

      // Mark all messages from the other participant as read
      let updated = false;
      chat.messages = chat.messages.map((message) => {
        if (
          message.sender.toString() === otherParticipantId.toString() &&
          !message.read
        ) {
          updated = true;
          return {
            ...message.toObject(),
            read: true,
          };
        }
        return message;
      });

      if (updated) {
        await chat.save();
      }

      res.status(200).json({
        message: "Messages marked as read successfully",
        chat,
      });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error marking messages as read",
          error: error.message,
        });
    }
  }
);

module.exports = router;

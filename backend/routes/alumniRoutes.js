// backend/routes/alumniRoutes.js
const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizeRoles,
  isOwnerOrAdmin,
} = require("../middleware/authMiddleware");
const Alumni = require("../models/Alumni");
const Student = require("../models/Student");
const Project = require("../models/Project");
const Internship = require("../models/Internship");
const Application = require("../models/Application");
const ProjectSubmission = require("../models/ProjectSubmission");
const Chat = require("../models/Chat");
const Notification = require("../models/Notification");
const ConnectionRequest = require("../models/ConnectionRequest");

// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = path.join(__dirname, "../uploads");
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /pdf|doc|docx|zip/;
//     const extname = allowedTypes.test(
//       path.extname(file.originalname).toLowerCase()
//     );
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb(
//         new Error(
//           "Invalid file type. Only PDF, DOC, DOCX, and ZIP files are allowed."
//         )
//       );
//     }
//   },
// });

// Get alumni profile
router.get(
  "/profile",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const alumni = await Alumni.findById(req.user._id).select("-password");

      if (!alumni) {
        return res.status(404).json({ message: "Alumni not found" });
      }

      res.status(200).json(alumni);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Update alumni profile
router.put(
  "/profile",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const {
        name,
        contactInfo,
        isProfilePublic,
        passoutYear,
        degree,
        bio,
        currentJobTitle,
        company,
        industry,
        skills,
        expertise,
      } = req.body;

      const updatedAlumni = await Alumni.findByIdAndUpdate(
        req.user._id,
        {
          name,
          contactInfo,
          isProfilePublic,
          passoutYear,
          degree,
          currentJobTitle,
          company,
          industry,
          skills,
          expertise,
          bio,
        },
        { new: true, runValidators: true }
      ).select("-password");
      console.log("Updated alumni profile:", updatedAlumni);
      res.status(200).json(updatedAlumni);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

//Connection Request Routes

// Get pending connection requests for alumni
router.get(
  "/connection-requests",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const alumniId = req.user.id;
      const { status = "pending" } = req.query;

      const connectionRequests = await ConnectionRequest.find({
        receiver: alumniId,
        status: status,
      })
        .populate("sender", "name email role")
        .sort({ createdAt: -1 });

      res.json(connectionRequests);
    } catch (error) {
      console.error("Error fetching connection requests:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Accept or reject connection request
router.put(
  "/connection-requests/:requestId",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const { requestId } = req.params;
      const { status } = req.body;
      const alumniId = req.user.id;

      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      // Find the connection request
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        receiver: alumniId,
        status: "pending",
      }).populate("sender");

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      // Update the status
      connectionRequest.status = status;
      await connectionRequest.save();

      // If accepted, create a chat between student and alumni
      if (status === "accepted") {
        // Check if a chat already exists
        const existingChat = await Chat.findOne({
          participants: { $all: [alumniId, connectionRequest.sender._id] },
        });

        if (!existingChat) {
          // Create a new chat
          const newChat = new Chat({
            participants: [alumniId, connectionRequest.sender._id],
            messages: [],
          });

          await newChat.save();
        }
      }

      res.json({
        message: `Connection request ${status}`,
        connectionRequest,
      });
    } catch (error) {
      console.error("Error updating connection request:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Project Routes

// Create a new project
router.post(
  "/projects",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    console.log("Creating project with data:", req.body);
    try {
      const {
        title,
        description,
        requirements,
        duration,
        skills,
        deadline,
        compensation,
        documents,
      } = req.body;

      const project = new Project({
        title,
        description,
        requirements,
        duration,
        skills,
        alumni: req.user._id,
        deadline: deadline ? new Date(deadline) : undefined,
        compensation,
        documents,
      });

      await project.save();
      console.log("Project created:", project);

      // Notify relevant students (based on skills match)
      const matchingStudents = await Student.find({
        skills: { $in: skills },
      });
      const notifications = matchingStudents.map((student) => ({
        recipient: student._id,
        type: "new_project",
        title: "New Project Matching Your Skills",
        message: `A new project "${title}" matching your skills has been posted.`,
        relatedItem: {
          itemId: project._id,
          itemType: "Project",
        },
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
      console.log("Notifications sent to students:", notifications);
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get all projects created by the alumni
router.get(
  "/projects",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const projects = await Project.find({ alumni: req.user._id }).sort({
        createdAt: -1,
      });
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get a specific project
router.get(
  "/projects/:id",
  authenticateUser,
  authorizeRoles("alumni"),
  isOwnerOrAdmin(Project),
  async (req, res) => {
    res.status(200).json(req.resource);
  }
);

// Update a project
router.put(
  "/projects/:id",
  authenticateUser,
  authorizeRoles("alumni"),
  isOwnerOrAdmin(Project),
  async (req, res) => {
    try {
      const {
        title,
        description,
        requirements,
        duration,
        skills,
        status,
        deadline,
        compensation,
        documents,
      } = req.body;

      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          requirements,
          duration,
          skills,
          status,
          deadline: deadline ? new Date(deadline) : undefined,
          compensation,
          documents,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json(updatedProject);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Delete a project
router.delete(
  "/projects/:id",
  authenticateUser,
  authorizeRoles("alumni"),
  isOwnerOrAdmin(Project),
  async (req, res) => {
    try {
      await Project.findByIdAndDelete(req.params.id);

      // Delete related applications
      await Application.deleteMany({
        opportunity: req.params.id,
        opportunityType: "Project",
      });

      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Internship Routes

// Create a new internship
router.post(
  "/internships",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const {
        title,
        company,
        description,
        requirements,
        location,
        isRemote,
        duration,
        stipend,
        deadline,
        startDate,
        skills,
      } = req.body;

      const internship = new Internship({
        title,
        company,
        description,
        requirements,
        location,
        isRemote,
        duration,
        stipend,
        alumni: req.user._id,
        deadline: deadline ? new Date(deadline) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        skills,
      });

      await internship.save();

      // Notify relevant students (based on skills match)
      const matchingStudents = await Student.find({
        skills: { $in: skills },
      });

      const notifications = matchingStudents.map((student) => ({
        recipient: student._id,
        type: "new_internship",
        title: "New Internship Matching Your Skills",
        message: `A new internship "${title}" at ${company} matching your skills has been posted.`,
        relatedItem: {
          itemId: internship._id,
          itemType: "Internship",
        },
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }

      res.status(201).json(internship);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get all internships created by the alumni
router.get(
  "/internships",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const internships = await Internship.find({ alumni: req.user._id }).sort({
        createdAt: -1,
      });
      res.status(200).json(internships);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get a specific internship
router.get(
  "/internships/:id",
  authenticateUser,
  authorizeRoles("alumni"),
  isOwnerOrAdmin(Internship),
  async (req, res) => {
    res.status(200).json(req.resource);
  }
);

// Update an internship
router.put(
  "/internships/:id",
  authenticateUser,
  authorizeRoles("alumni"),
  isOwnerOrAdmin(Internship),
  async (req, res) => {
    try {
      const {
        title,
        company,
        description,
        requirements,
        location,
        isRemote,
        duration,
        stipend,
        status,
        deadline,
        startDate,
        skills,
      } = req.body;

      const updatedInternship = await Internship.findByIdAndUpdate(
        req.params.id,
        {
          title,
          company,
          description,
          requirements,
          location,
          isRemote,
          duration,
          stipend,
          status,
          deadline: deadline ? new Date(deadline) : undefined,
          startDate: startDate ? new Date(startDate) : undefined,
          skills,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json(updatedInternship);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Delete an internship
router.delete(
  "/internships/:id",
  authenticateUser,
  authorizeRoles("alumni"),
  isOwnerOrAdmin(Internship),
  async (req, res) => {
    try {
      await Internship.findByIdAndDelete(req.params.id);

      // Delete related applications
      await Application.deleteMany({
        opportunity: req.params.id,
        opportunityType: "Internship",
      });

      res.status(200).json({ message: "Internship deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Application Management Routes

// Get all applications for alumni's projects and internships
router.get(
  "/applications",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      // Get all projects and internships by this alumni
      const projects = await Project.find({ alumni: req.user._id }).select(
        "_id"
      );
      const internships = await Internship.find({
        alumni: req.user._id,
      }).select("_id");

      const projectIds = projects.map((project) => project._id);
      const internshipIds = internships.map((internship) => internship._id);

      // Get applications for these opportunities
      const applications = await Application.find({
        $or: [
          { opportunity: { $in: projectIds }, opportunityType: "Project" },
          {
            opportunity: { $in: internshipIds },
            opportunityType: "Internship",
          },
        ],
      })
        .populate(
          "student",
          "name email contactInfo semester degreePrograms skills"
        )
        .populate({
          path: "opportunity",
          select: "title description company",
          refPath: "opportunityType",
        })
        .sort({ submissionDate: -1 });

      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get a specific application
router.get(
  "/applications/:id",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const application = await Application.findById(req.params.id)
        .populate(
          "student",
          "name email contactInfo semester degreePrograms skills"
        )
        .populate({
          path: "opportunity",
          select: "title description alumni company",
          refPath: "opportunityType",
        });

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      // Check if this application is for an opportunity created by this alumni
      const opportunity = application.opportunity;
      if (opportunity.alumni.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to access this application" });
      }

      res.status(200).json(application);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Update application status (accept/reject)
router.put(
  "/applications/:id",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const { status, feedback } = req.body;

      const application = await Application.findById(req.params.id).populate({
        path: "opportunity",
        refPath: "opportunityType",
      });

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      // Check if this application is for an opportunity created by this alumni
      const opportunity = application.opportunity;
      if (opportunity.alumni.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this application" });
      }

      // Update application status
      application.status = status;
      application.feedback = feedback;
      await application.save();

      // If application is accepted, update the opportunity status
      if (status === "Accepted") {
        // Update the opportunity status to "Occupied"
        if (application.opportunityType === "Project") {
          await Project.findByIdAndUpdate(opportunity._id, {
            status: "Occupied",
          });
        } else if (application.opportunityType === "Internship") {
          await Internship.findByIdAndUpdate(opportunity._id, {
            status: "Occupied",
          });
        }

        // Reject all other pending applications for this opportunity
        await Application.updateMany(
          {
            _id: { $ne: application._id },
            opportunity: opportunity._id,
            opportunityType: application.opportunityType,
            status: "Pending",
          },
          {
            status: "Rejected",
            feedback:
              "Another candidate has been selected for this opportunity.",
          }
        );
      }

      // Create notification for the student
      await Notification.create({
        recipient: application.student,
        type: "application_status",
        title: `Application ${status}`,
        message: `Your application for ${
          opportunity.title
        } has been ${status.toLowerCase()}.`,
        relatedItem: {
          itemId: application._id,
          itemType: "Application",
        },
      });

      res.status(200).json(application);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Project Submission Management Routes

// Get all project submissions
router.get(
  "/submissions",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      // Get all projects by this alumni
      const projects = await Project.find({ alumni: req.user._id }).select(
        "_id"
      );
      const projectIds = projects.map((project) => project._id);

      // Get submissions for these projects
      const submissions = await ProjectSubmission.find({
        project: { $in: projectIds },
      })
        .populate("project", "title status")
        .populate("student", "name email")
        .sort({ submissionDate: -1 });

      res.status(200).json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get a specific submission
router.get(
  "/submissions/:id",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const submission = await ProjectSubmission.findById(req.params.id)
        .populate("project", "title description requirements alumni")
        .populate("student", "name email contactInfo");

      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      // Check if this submission is for a project created by this alumni
      if (submission.project.alumni.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to access this submission" });
      }

      res.status(200).json(submission);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Update submission status (review, accept, reject)
router.put(
  "/submissions/:id",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const { status, feedback } = req.body;

      const submission = await ProjectSubmission.findById(req.params.id)
        .populate("project", "alumni")
        .populate("student", "_id");

      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      // Check if this submission is for a project created by this alumni
      if (submission.project.alumni.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this submission" });
      }

      // Update submission status
      submission.status = status;
      submission.feedback = feedback;
      await submission.save();

      // If submission is accepted, update the project status to "Completed"
      if (status === "Accepted") {
        await Project.findByIdAndUpdate(submission.project._id, {
          status: "Completed",
        });
      }

      // Create notification for the student
      await Notification.create({
        recipient: submission.student._id,
        type: "project_submission",
        title: `Project Submission ${status}`,
        message: `Your project submission has been ${status.toLowerCase()}.`,
        relatedItem: {
          itemId: submission._id,
          itemType: "ProjectSubmission",
        },
      });

      res.status(200).json(submission);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Chat Management Routes

// Get all chats for alumni
router.get(
  "/chats",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const chats = await Chat.find({ participants: req.user._id })
        .populate("participants", "name role")
        .sort({ lastMessage: -1 });

      res.status(200).json(chats);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get a specific chat
router.get(
  "/chats/:id",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const chat = await Chat.findById(req.params.id)
        .populate("participants", "name role")
        .populate("project", "title")
        .populate("internship", "title");

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      // Check if this alumni is a participant in the chat
      if (
        !chat.participants.some(
          (p) => p._id.toString() === req.user._id.toString()
        )
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to access this chat" });
      }

      // Mark all messages as read
      chat.messages.forEach((message) => {
        if (message.sender.toString() !== req.user._id.toString()) {
          message.read = true;
        }
      });
      await chat.save();

      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Start a new chat with a student
router.post(
  "/chats",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const { studentId, projectId, internshipId, initialMessage } = req.body;

      // Check if chat already exists
      let existingChat = await Chat.findOne({
        participants: { $all: [req.user._id, studentId] },
        ...(projectId && { project: projectId }),
        ...(internshipId && { internship: internshipId }),
      });

      if (existingChat) {
        // Add new message to existing chat
        existingChat.messages.push({
          sender: req.user._id,
          content: initialMessage,
          timestamp: Date.now(),
        });
        existingChat.lastMessage = Date.now();
        await existingChat.save();

        // Create notification for the student
        await Notification.create({
          recipient: studentId,
          type: "message",
          title: "New Message",
          message: `You have a new message from ${req.user.name}`,
          relatedItem: {
            itemId: existingChat._id,
            itemType: "Chat",
          },
        });

        return res.status(200).json(existingChat);
      }

      // Create new chat
      const newChat = new Chat({
        participants: [req.user._id, studentId],
        messages: [
          {
            sender: req.user._id,
            content: initialMessage,
            timestamp: Date.now(),
          },
        ],
        ...(projectId && { project: projectId }),
        ...(internshipId && { internship: internshipId }),
      });

      await newChat.save();

      // Create notification for the student
      await Notification.create({
        recipient: studentId,
        type: "message",
        title: "New Message",
        message: `You have a new message from ${req.user.name}`,
        relatedItem: {
          itemId: newChat._id,
          itemType: "Chat",
        },
      });

      res.status(201).json(newChat);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Send a message in an existing chat
router.post(
  "/chats/:id/messages",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const { content } = req.body;
      const chatId = req.params.id;

      const chat = await Chat.findById(chatId);

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      // Check if this alumni is a participant in the chat
      if (
        !chat.participants.some((p) => p.toString() === req.user._id.toString())
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to send messages in this chat" });
      }

      // Add new message
      const newMessage = {
        sender: req.user._id,
        content,
        timestamp: Date.now(),
      };

      chat.messages.push(newMessage);
      chat.lastMessage = Date.now();
      await chat.save();

      // Find the other participant (student)
      const studentId = chat.participants.find(
        (p) => p.toString() !== req.user._id.toString()
      );

      // Create notification for the student
      await Notification.create({
        recipient: studentId,
        type: "message",
        title: "New Message",
        message: `You have a new message from ${req.user.name}`,
        relatedItem: {
          itemId: chat._id,
          itemType: "Chat",
        },
      });

      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get notifications for alumni
router.get(
  "/notifications",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const notifications = await Notification.find({
        recipient: req.user._id,
      })
        .sort({ createdAt: -1 })
        .limit(50);

      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Mark notification as read
router.put(
  "/notifications/:id",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const notification = await Notification.findById(req.params.id);

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      // Check if this notification belongs to this alumni
      if (notification.recipient.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this notification" });
      }

      notification.read = true;
      await notification.save();

      res.status(200).json(notification);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Mark all notifications as read
router.put(
  "/notifications",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      await Notification.updateMany(
        { recipient: req.user._id, read: false },
        { read: true }
      );

      res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get dashboard stats
router.get(
  "/dashboard",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      // Count projects
      const projectsCount = await Project.countDocuments({
        alumni: req.user._id,
      });
      const activeProjectsCount = await Project.countDocuments({
        alumni: req.user._id,
        status: { $in: ["Open", "Occupied"] },
      });
      const completedProjectsCount = await Project.countDocuments({
        alumni: req.user._id,
        status: "Completed",
      });

      // Count internships
      const internshipsCount = await Internship.countDocuments({
        alumni: req.user._id,
      });
      const activeInternshipsCount = await Internship.countDocuments({
        alumni: req.user._id,
        status: { $in: ["Open", "Occupied"] },
      });

      // Count applications
      const projectIds = await Project.find({ alumni: req.user._id }).select(
        "_id"
      );
      const internshipIds = await Internship.find({
        alumni: req.user._id,
      }).select("_id");

      const applicationsCount = await Application.countDocuments({
        $or: [
          {
            opportunity: { $in: projectIds.map((p) => p._id) },
            opportunityType: "Project",
          },
          {
            opportunity: { $in: internshipIds.map((i) => i._id) },
            opportunityType: "Internship",
          },
        ],
      });

      const pendingApplicationsCount = await Application.countDocuments({
        $or: [
          {
            opportunity: { $in: projectIds.map((p) => p._id) },
            opportunityType: "Project",
          },
          {
            opportunity: { $in: internshipIds.map((i) => i._id) },
            opportunityType: "Internship",
          },
        ],
        status: "Pending",
      });

      // Count submissions
      const submissionsCount = await ProjectSubmission.countDocuments({
        project: { $in: projectIds.map((p) => p._id) },
      });

      const pendingSubmissionsCount = await ProjectSubmission.countDocuments({
        project: { $in: projectIds.map((p) => p._id) },
        status: "Submitted",
      });

      // Count unread notifications
      const unreadNotificationsCount = await Notification.countDocuments({
        recipient: req.user._id,
        read: false,
      });

      // Count chats
      const chatsCount = await Chat.countDocuments({
        participants: req.user._id,
      });

      // Count connected students (unique students from chats)
      const chats = await Chat.find({ participants: req.user._id });
      const connectedStudentIds = new Set();

      chats.forEach((chat) => {
        chat.participants.forEach((participant) => {
          if (participant.toString() !== req.user._id.toString()) {
            connectedStudentIds.add(participant.toString());
          }
        });
      });

      // Get recent applications
      const recentApplications = await Application.find({
        $or: [
          {
            opportunity: { $in: projectIds.map((p) => p._id) },
            opportunityType: "Project",
          },
          {
            opportunity: { $in: internshipIds.map((i) => i._id) },
            opportunityType: "Internship",
          },
        ],
      })
        .sort({ submissionDate: -1 })
        .limit(5)
        .populate("student", "name")
        .populate({
          path: "opportunity",
          select: "title",
          refPath: "opportunityType",
        });

      res.status(200).json({
        projectsStats: {
          total: projectsCount,
          active: activeProjectsCount,
          completed: completedProjectsCount,
        },
        internshipsStats: {
          total: internshipsCount,
          active: activeInternshipsCount,
        },
        applicationsStats: {
          total: applicationsCount,
          pending: pendingApplicationsCount,
        },
        submissionsStats: {
          total: submissionsCount,
          pending: pendingSubmissionsCount,
        },
        connectionsStats: {
          chats: chatsCount,
          connectedStudents: connectedStudentIds.size,
        },
        notifications: {
          unread: unreadNotificationsCount,
        },
        recentApplications,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);
// Mark messages as read in a chat
router.post(
  "/chats/:chatId/read",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const chatId = req.params.chatId;

      // Find chat and verify alumni is a participant
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

      // Use the more efficient MongoDB update operator approach
      const result = await Chat.updateOne(
        { _id: chatId },
        {
          $set: {
            "messages.$[elem].read": true,
          },
        },
        {
          arrayFilters: [
            { "elem.sender": otherParticipantId, "elem.read": false },
          ],
        }
      );

      // Fetch the updated chat to return to the client
      const updatedChat = await Chat.findById(chatId)
        .populate("participants", "name email role")
        .populate("project", "title")
        .populate("internship", "title");

      res.status(200).json({
        message: "Messages marked as read successfully",
        chat: updatedChat,
        updated: result.modifiedCount > 0,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error marking messages as read",
        error: error.message,
      });
    }
  }
);

// Get a single chat for alumni
router.get(
  "/chats/:chatId",
  authenticateUser,
  authorizeRoles("alumni"),
  async (req, res) => {
    try {
      const chatId = req.params.chatId;

      // Find chat and verify alumni is a participant
      const chat = await Chat.findOne({
        _id: chatId,
        participants: req.user._id,
      })
        .populate("participants", "name email role")
        .populate("project", "title")
        .populate("internship", "title");

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      res.status(200).json(chat);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching chat", error: error.message });
    }
  }
);
module.exports = router;

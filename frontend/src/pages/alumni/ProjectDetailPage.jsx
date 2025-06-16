import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api"; // Adjust the path based on your project structure
import { useAuth } from "../../context/AuthContext";

const ProjectDetailPage = () => {
  const { id } = useParams(); // Get project ID from URL
  const navigate = useNavigate();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    duration: "",
    skills: [],
    status: "",
    deadline: "",
    compensation: "",
    documents: [],
  });

  // Fetch project data when component mounts
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/alumni/projects/${id}`);
        setProject(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          requirements: response.data.requirements,
          duration: response.data.duration,
          skills: response.data.skills || [],
          status: response.data.status,
          deadline: response.data.deadline
            ? new Date(response.data.deadline).toISOString().split("T")[0]
            : "",
          compensation: response.data.compensation || "",
          documents: response.data.documents || [],
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch project");
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle skills as comma-separated strings
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({ ...prev, skills: skillsArray }));
  };

  // Handle file selection
  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Reset upload progress
    const initialProgress = {};
    files.forEach((file, index) => {
      initialProgress[index] = 0;
    });
    setUploadProgress(initialProgress);
  };

  // Upload files to server
  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return [];

    setUploadingFiles(true);

    try {
      // Use the multi-file upload endpoint for better efficiency
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await api.post("/upload/multi", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // Update progress for all files (since we're uploading as batch)
          const progressUpdate = {};
          files.forEach((_, index) => {
            progressUpdate[index] = percentCompleted;
          });
          setUploadProgress(progressUpdate);
        },
      });

      if (response.data && response.data.fileUrls) {
        return response.data.fileUrls;
      } else {
        throw new Error("Upload response missing file URLs");
      }
    } catch (error) {
      console.error("File upload error:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to upload files. Please try again."
      );
    } finally {
      setUploadingFiles(false);
    }
  };

  // Remove selected file from new uploads
  const removeSelectedFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);

    // Update progress object
    const newProgress = {};
    newFiles.forEach((file, i) => {
      newProgress[i] = uploadProgress[i] || 0;
    });
    setUploadProgress(newProgress);
  };

  // Remove existing document from project
  const removeExistingDocument = (index) => {
    const newDocuments = formData.documents.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, documents: newDocuments }));
  };

  // Handle project update
  const handleUpdate = async () => {
    try {
      setError("");

      // First upload new files if any are selected
      let newDocumentUrls = [];
      if (selectedFiles.length > 0) {
        newDocumentUrls = await uploadFiles(selectedFiles);
      }

      // Combine existing documents with new uploads
      const updatedFormData = {
        ...formData,
        documents: [...formData.documents, ...newDocumentUrls],
      };

      await api.put(`/alumni/projects/${id}`, updatedFormData);
      setProject({ ...project, ...updatedFormData }); // Update local state
      setFormData(updatedFormData); // Update form data
      setSelectedFiles([]); // Clear selected files
      setUploadProgress({}); // Clear upload progress
      setIsEditing(false); // Exit edit mode
      alert("Project updated successfully");
    } catch (err) {
      setError(
        err.message || err.response?.data?.message || "Failed to update project"
      );
    }
  };

  // Handle project deletion
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await api.delete(`/alumni/projects/${id}`);
        alert("Project deleted successfully");
        navigate("/alumni/dashboard"); // Redirect to dashboard
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete project");
      }
    }
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get file type icon
  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    const icons = {
      pdf: "📄",
      doc: "📝",
      docx: "📝",
      zip: "📦",
    };
    return icons[extension] || "📎";
  };

  // Get filename from URL
  const getFilenameFromUrl = (url) => {
    return url.split("/").pop() || url;
  };

  // Function to determine status color, matching internship styling
  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return "text-green-600 bg-green-50 border-green-200";
      case "Occupied":
        return "text-[#123458] bg-[#f4f7fa] border-[#B8C8D9]";
      case "Completed":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Render loading, error, or not found states
  if (loading) return (
    <div className="min-h-screen bg-[#f4f7fa] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#123458] mx-auto mb-4"></div>
        <p className="text-[#123458] text-lg">Loading project details...</p>
      </div>
    </div>
  );
  
  if (error && !project) return (
    <div className="min-h-screen bg-[#f4f7fa] flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-red-200">
        <div className="text-red-600 text-6xl mb-4">⚠️</div>
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    </div>
  );
  
  if (!project) return (
    <div className="min-h-screen bg-[#f4f7fa] flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-[#B8C8D9] text-6xl mb-4">📋</div>
        <p className="text-[#123458] text-lg font-semibold">Project not found</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/alumni/dashboard")}
            className="flex items-center space-x-2 text-[#123458] hover:text-[#B8C8D9] font-medium transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Project details or edit form */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#B8C8D9]/20 overflow-hidden">
          {isEditing ? (
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-[#f4f7fa] rounded-lg">
                  <svg className="w-6 h-6 text-[#123458]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-[#123458]">Edit Project</h2>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                  {error}
                </div>
              )}

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#123458] mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#B8C8D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#123458] mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-[#B8C8D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent transition-all duration-200 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#123458] mb-2">
                    Requirements
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-[#B8C8D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent transition-all duration-200 resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#123458] mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 2 months, 6 weeks"
                      className="w-full px-4 py-3 border border-[#B8C8D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#123458] mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#B8C8D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent transition-all duration-200"
                    >
                      <option value="Open">Open</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#123458] mb-2">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#B8C8D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#123458] mb-2">
                      Compensation
                    </label>
                    <select
                      name="compensation"
                      value={formData.compensation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#B8C8D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent transition-all duration-200"
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Paid">Paid</option>
                      <option value="Certificate">Certificate</option>
                      <option value="Experience">Experience</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#123458] mb-2">
                    Required Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills.join(", ")}
                    onChange={handleSkillsChange}
                    placeholder="e.g., React, Node.js, MongoDB"
                    className="w-full px-4 py-3 border border-[#B8C8D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Existing Documents Section */}
                <div>
                  <label className="block text-sm font-semibold text-[#123458] mb-4">
                    Current Documents
                  </label>
                  {formData.documents && formData.documents.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {formData.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-xl bg-[#f4f7fa] border border-[#B8C8D9]/20"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getFileIcon(doc)}</span>
                            <div>
                              <p className="text-sm font-medium truncate max-w-xs text-[#123458]">
                                {getFilenameFromUrl(doc)}
                              </p>
                              <a
                                href={doc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#123458] hover:underline"
                              >
                                View Document
                              </a>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExistingDocument(index)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                            disabled={uploadingFiles}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm mb-4 text-[#123458]">
                      No documents currently attached
                    </p>
                  )}
                </div>

                {/* Add New Documents Section */}
                <div>
                  <label className="block text-sm font-semibold text-[#123458] mb-2">
                    Add New Documents (optional)
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelection}
                    className="w-full px-4 py-3 border border-[#B8C8D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent transition-all duration-200"
                    accept=".pdf,.doc,.docx,.zip"
                    disabled={uploadingFiles}
                  />
                  <p className="text-sm mt-2 text-[#123458]">
                    Accepted formats: PDF, DOC, DOCX, ZIP (Max 10MB each, up to 5 files)
                  </p>

                  {/* Display selected new files */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <h4 className="font-semibold text-[#123458]">
                        New Files to Upload:
                      </h4>
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#B8C8D9]/20"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">
                              {getFileIcon(file.name)}
                            </span>
                            <div>
                              <p className="text-sm font-medium truncate max-w-xs text-[#123458]">
                                {file.name}
                              </p>
                              <p className="text-xs text-[#123458]">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {uploadingFiles &&
                              uploadProgress[index] !== undefined && (
                                <div className="flex items-center space-x-2">
                                  <div className="w-16 rounded-full h-2 bg-[#B8C8D9]">
                                    <div
                                      className="h-2 rounded-full transition-all duration-300 bg-[#123458]"
                                      style={{
                                        width: `${uploadProgress[index]}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-[#123458]">
                                    {uploadProgress[index]}%
                                  </span>
                                </div>
                              )}
                            <button
                              type="button"
                              onClick={() => removeSelectedFile(index)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                              disabled={uploadingFiles}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-[#B8C8D9]/20">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedFiles([]);
                      setUploadProgress({});
                      setError("");
                    }}
                    className="px-6 py-3 bg-[#B8C8D9] text-[#123458] font-semibold rounded-xl hover:bg-[#B8C8D9]/80 transition-colors duration-200"
                    disabled={uploadingFiles}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={uploadingFiles}
                    className={`px-6 py-3 bg-[#123458] text-white font-semibold rounded-xl hover:bg-[#123458]/90 transition-colors duration-200 ${
                      uploadingFiles ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {uploadingFiles ? "Uploading..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-[#123458] to-[#123458]/80 p-8 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
                    <p className="text-xl text-white/90 mb-4">Project Opportunity</p>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getStatusClass(project.status)} font-semibold text-sm`}>
                      <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                      {project.status}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-xl font-medium transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-[#123458] mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Description
                      </h3>
                      <div className="bg-[#f4f7fa] p-6 rounded-xl border border-[#B8C8D9]/20">
                        <p className="text-[#123458] leading-relaxed">{project.description}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-[#123458] mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        Requirements
                      </h3>
                      <div className="bg-[#f4f7fa] p-6 rounded-xl border border-[#B8C8D9]/20">
                        <p className="text-[#123458] leading-relaxed">{project.requirements}</p>
                      </div>
                    </div>

                    {project.skills && project.skills.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-[#123458] mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Required Skills
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {project.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-[#123458] text-white text-sm font-medium rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Documents Section */}
                    <div>
                      <h3 className="text-xl font-bold text-[#123458] mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Project Documents
                      </h3>
                      {project.documents && project.documents.length > 0 ? (
                        <div className="space-y-3">
                          {project.documents.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 rounded-xl bg-[#f4f7fa] border border-[#B8C8D9]/20 hover:shadow-md transition-shadow duration-200"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{getFileIcon(doc)}</span>
                                <div>
                                  <p className="text-sm font-medium text-[#123458] truncate max-w-xs">
                                    {getFilenameFromUrl(doc)}
                                  </p>
                                  <a
                                    href={doc}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-[#123458] hover:underline flex items-center space-x-1"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    <span>View Document</span>
                                  </a>
                                </div>
                              </div>
                              <button
                                onClick={() => window.open(doc, '_blank')}
                                className="p-2 text-[#123458] hover:bg-[#123458] hover:text-white rounded-lg transition-colors duration-200"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-[#f4f7fa] rounded-xl border border-[#B8C8D9]/20">
                          <svg className="w-12 h-12 text-[#B8C8D9] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-[#123458] font-medium">No documents attached</p>
                          <p className="text-sm text-[#123458]/60 mt-1">Documents will appear here when added</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Project Info Card */}
                    <div className="bg-[#f4f7fa] p-6 rounded-xl border border-[#B8C8D9]/20">
                      <h3 className="text-lg font-bold text-[#123458] mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Project Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-[#123458] mb-1">Duration</p>
                          <p className="text-[#123458]">{project.duration}</p>
                        </div>
                        
                        {project.deadline && (
                          <div>
                            <p className="text-sm font-semibold text-[#123458] mb-1">Application Deadline</p>
                            <p className="text-[#123458] flex items-center space-x-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{new Date(project.deadline).toLocaleDateString()}</span>
                            </p>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-sm font-semibold text-[#123458] mb-1">Compensation</p>
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-[#123458]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span className="text-[#123458]">{project.compensation || 'Not specified'}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-[#123458] mb-1">Posted Date</p>
                          <p className="text-[#123458] flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Recently'}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="bg-white p-6 rounded-xl border border-[#B8C8D9]/20 shadow-sm">
                      <h3 className="text-lg font-bold text-[#123458] mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Quick Actions
                      </h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#123458] text-white rounded-xl font-medium hover:bg-[#123458]/90 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit Project</span>
                        </button>
                        
                        <button
                          onClick={handleDelete}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors duration-200 border border-red-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete Project</span>
                        </button>

                        <div className="pt-3 border-t border-[#B8C8D9]/20">
                          <button
                            onClick={() => window.print()}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-[#123458] hover:bg-[#f4f7fa] rounded-xl font-medium transition-colors duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            <span>Print Details</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Project Statistics Card */}
                    <div className="bg-gradient-to-br from-[#123458] to-[#123458]/80 p-6 rounded-xl text-white">
                      <h3 className="text-lg font-bold mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Project Stats
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white/80">Skills Required</span>
                          <span className="font-semibold">{project.skills ? project.skills.length : 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/80">Documents</span>
                          <span className="font-semibold">{project.documents ? project.documents.length : 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/80">Status</span>
                          <span className="font-semibold">{project.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
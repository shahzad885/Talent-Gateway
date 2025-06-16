// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api"; // Import centralized Axios instance
// import { useAuth } from "../../context/AuthContext";

// const CreateProject = () => {
//   const navigate = useNavigate();
//   const { token } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [uploadingFiles, setUploadingFiles] = useState(false);
//   const [error, setError] = useState("");
//   const [project, setProject] = useState({
//     title: "",
//     description: "",
//     requirements: "",
//     duration: "",
//     skills: [],
//     deadline: "",
//     compensation: "Unpaid",
//     documents: [],
//   });
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [uploadProgress, setUploadProgress] = useState({});

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProject({ ...project, [name]: value });
//   };

//   // Handle skills input (comma separated)
//   const handleSkillsChange = (e) => {
//     const skillsArray = e.target.value.split(",").map((skill) => skill.trim());
//     setProject({ ...project, skills: skillsArray });
//   };

//   // Handle file selection
//   const handleFileSelection = (e) => {
//     const files = Array.from(e.target.files);
//     setSelectedFiles(files);

//     // Reset upload progress
//     const initialProgress = {};
//     files.forEach((file, index) => {
//       initialProgress[index] = 0;
//     });
//     setUploadProgress(initialProgress);
//   };

//   // Upload files to server
//   const uploadFiles = async (files) => {
//     if (!files || files.length === 0) return [];

//     setUploadingFiles(true);

//     try {
//       // Use the multi-file upload endpoint for better efficiency
//       const formData = new FormData();
//       files.forEach((file) => {
//         formData.append("files", file);
//       });

//       const response = await api.post("/upload/multi", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           // Update progress for all files (since we're uploading as batch)
//           const progressUpdate = {};
//           files.forEach((_, index) => {
//             progressUpdate[index] = percentCompleted;
//           });
//           setUploadProgress(progressUpdate);
//         },
//       });

//       if (response.data && response.data.fileUrls) {
//         return response.data.fileUrls;
//       } else {
//         throw new Error("Upload response missing file URLs");
//       }
//     } catch (error) {
//       console.error("File upload error:", error);
//       throw new Error(
//         error.response?.data?.message ||
//           "Failed to upload files. Please try again."
//       );
//     } finally {
//       setUploadingFiles(false);
//     }
//   };

//   // Remove selected file
//   const removeFile = (index) => {
//     const newFiles = selectedFiles.filter((_, i) => i !== index);
//     setSelectedFiles(newFiles);

//     // Update progress object
//     const newProgress = {};
//     newFiles.forEach((file, i) => {
//       newProgress[i] = uploadProgress[i] || 0;
//     });
//     setUploadProgress(newProgress);
//   };

//   // Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // First upload files if any are selected
//       let documentUrls = [];
//       if (selectedFiles.length > 0) {
//         documentUrls = await uploadFiles(selectedFiles);
//       }

//       // Create project with uploaded document URLs
//       const projectData = {
//         ...project,
//         documents: documentUrls,
//       };

//       const response = await api.post("/alumni/projects", projectData);

//       if (response.status === 201) {
//         // Project created successfully
//         navigate("/alumni");
//       }
//     } catch (err) {
//       setError(
//         err.message ||
//           err.response?.data?.message ||
//           "Failed to create project. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Format file size for display
//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   // Get file type icon
//   const getFileIcon = (fileName) => {
//     const extension = fileName.split(".").pop().toLowerCase();
//     const icons = {
//       pdf: "📄",
//       doc: "📝",
//       docx: "📝",
//       zip: "📦",
//     };
//     return icons[extension] || "📎";
//   };

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
//         <h1 className="text-2xl font-bold mb-6">Create New Project</h1>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label
//               className="block text-gray-700 font-bold mb-2"
//               htmlFor="title"
//             >
//               Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={project.title}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label
//               className="block text-gray-700 font-bold mb-2"
//               htmlFor="description"
//             >
//               Description
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               value={project.description}
//               onChange={handleChange}
//               rows="4"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             ></textarea>
//           </div>

//           <div className="mb-4">
//             <label
//               className="block text-gray-700 font-bold mb-2"
//               htmlFor="requirements"
//             >
//               Requirements
//             </label>
//             <textarea
//               id="requirements"
//               name="requirements"
//               value={project.requirements}
//               onChange={handleChange}
//               rows="3"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             ></textarea>
//           </div>

//           <div className="mb-4">
//             <label
//               className="block text-gray-700 font-bold mb-2"
//               htmlFor="duration"
//             >
//               Duration
//             </label>
//             <input
//               type="text"
//               id="duration"
//               name="duration"
//               placeholder="e.g., 2 months, 6 weeks"
//               value={project.duration}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label
//               className="block text-gray-700 font-bold mb-2"
//               htmlFor="skills"
//             >
//               Required Skills (comma separated)
//             </label>
//             <input
//               type="text"
//               id="skills"
//               name="skills"
//               placeholder="e.g., React, Node.js, MongoDB"
//               value={project.skills.join(", ")}
//               onChange={handleSkillsChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label
//               className="block text-gray-700 font-bold mb-2"
//               htmlFor="deadline"
//             >
//               Application Deadline
//             </label>
//             <input
//               type="date"
//               id="deadline"
//               name="deadline"
//               value={project.deadline}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="mb-4">
//             <label
//               className="block text-gray-700 font-bold mb-2"
//               htmlFor="compensation"
//             >
//               Compensation
//             </label>
//             <select
//               id="compensation"
//               name="compensation"
//               value={project.compensation}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="Unpaid">Unpaid</option>
//               <option value="Paid">Paid</option>
//               <option value="Certificate">Certificate</option>
//               <option value="Experience">Experience</option>
//             </select>
//           </div>

//           <div className="mb-4">
//             <label
//               className="block text-gray-700 font-bold mb-2"
//               htmlFor="documents"
//             >
//               Supporting Documents (optional)
//             </label>
//             <input
//               type="file"
//               id="documents"
//               name="documents"
//               multiple
//               onChange={handleFileSelection}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               accept=".pdf,.doc,.docx,.zip"
//             />
//             <p className="text-sm text-gray-500 mt-1">
//               Accepted formats: PDF, DOC, DOCX, ZIP (Max 10MB each, up to 5
//               files)
//             </p>

//             {/* Display selected files */}
//             {selectedFiles.length > 0 && (
//               <div className="mt-4 space-y-2">
//                 <h4 className="font-semibold text-gray-700">Selected Files:</h4>
//                 {selectedFiles.map((file, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between p-3 bg-gray-50 rounded-md border"
//                   >
//                     <div className="flex items-center space-x-3">
//                       <span className="text-2xl">{getFileIcon(file.name)}</span>
//                       <div>
//                         <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
//                           {file.name}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           {formatFileSize(file.size)}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       {uploadingFiles &&
//                         uploadProgress[index] !== undefined && (
//                           <div className="flex items-center space-x-2">
//                             <div className="w-16 bg-gray-200 rounded-full h-2">
//                               <div
//                                 className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                                 style={{ width: `${uploadProgress[index]}%` }}
//                               ></div>
//                             </div>
//                             <span className="text-xs text-gray-600">
//                               {uploadProgress[index]}%
//                             </span>
//                           </div>
//                         )}
//                       <button
//                         type="button"
//                         onClick={() => removeFile(index)}
//                         className="text-red-500 hover:text-red-700 text-sm font-medium"
//                         disabled={uploadingFiles}
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="flex items-center justify-between mt-6">
//             <button
//               type="button"
//               onClick={() => navigate("/alumni")}
//               className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
//               disabled={loading || uploadingFiles}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading || uploadingFiles}
//               className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 loading || uploadingFiles ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               {uploadingFiles
//                 ? "Uploading Files..."
//                 : loading
//                 ? "Creating..."
//                 : "Create Project"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateProject;












import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // Import centralized Axios instance
import { useAuth } from "../../context/AuthContext";

const CreateProject = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [error, setError] = useState("");
  const [project, setProject] = useState({
    title: "",
    description: "",
    requirements: "",
    duration: "",
    skills: [],
    deadline: "",
    documents: [],
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  // Handle skills input (comma separated)
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(",").map((skill) => skill.trim());
    setProject({ ...project, skills: skillsArray });
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

  // Remove selected file
  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);

    // Update progress object
    const newProgress = {};
    newFiles.forEach((file, i) => {
      newProgress[i] = uploadProgress[i] || 0;
    });
    setUploadProgress(newProgress);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First upload files if any are selected
      let documentUrls = [];
      if (selectedFiles.length > 0) {
        documentUrls = await uploadFiles(selectedFiles);
      }

      // Create project with uploaded document URLs
      const projectData = {
        ...project,
        documents: documentUrls,
      };

      const response = await api.post("/alumni/projects", projectData);

      if (response.status === 201) {
        // Project created successfully
        navigate("/alumni");
      }
    } catch (err) {
      setError(
        err.message ||
          err.response?.data?.message ||
          "Failed to create project. Please try again."
      );
    } finally {
      setLoading(false);
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

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-8 px-4"
      style={{ backgroundColor: '#f4f7fa' }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10 animate-pulse"
          style={{ backgroundColor: '#B8C8D9' }}
        ></div>
        <div 
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10 animate-pulse"
          style={{ backgroundColor: '#D4C9BE' }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full opacity-5 animate-bounce"
          style={{ backgroundColor: '#123458' }}
        ></div>
        <div 
          className="absolute top-1/4 right-1/3 w-24 h-24 rounded-full opacity-5 animate-pulse"
          style={{ backgroundColor: '#D4C9BE' }}
        ></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Header section */}
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg"
            style={{ backgroundColor: '#123458' }}
          >
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#123458' }}>
            Create New Project
          </h1>
          <p className="text-gray-600">Share your project with talented students</p>
        </div>

        {/* Main form card */}
        <div 
          className="backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl p-8 border border-white/20"
          style={{ 
            boxShadow: '0 25px 50px -12px rgba(18, 52, 88, 0.15)',
          }}
        >
          {error && (
            <div 
              className="flex items-center p-4 mb-6 rounded-2xl"
              style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
            >
              <svg className="w-5 h-5 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                Project Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={project.title}
                onChange={handleChange}
                className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
                placeholder="Enter your project title"
                required
              />
            </div>

            {/* Project Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                Project Description
              </label>
              <textarea
                id="description"
                name="description"
                value={project.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50 resize-none"
                placeholder="Describe your project in detail"
                required
              ></textarea>
            </div>

            {/* Project Requirements */}
            <div className="space-y-2">
              <label htmlFor="requirements" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                Project Requirements
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={project.requirements}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50 resize-none"
                placeholder="List the specific requirements for this project"
                required
              ></textarea>
            </div>

            {/* Duration and Deadline Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="duration" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  placeholder="e.g., 2 months, 6 weeks"
                  value={project.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="deadline" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                  Application Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={project.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 bg-white/50"
                />
              </div>
            </div>

            {/* Required Skills */}
            <div className="space-y-2">
              <label htmlFor="skills" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                Required Skills
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                placeholder="e.g., React, Node.js, MongoDB"
                value={project.skills.join(", ")}
                onChange={handleSkillsChange}
                className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate skills with commas
              </p>
            </div>

            {/* Supporting Documents */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold" style={{ color: '#123458' }}>
                Supporting Documents <span className="font-normal text-xs text-gray-500">(optional)</span>
              </label>
              
              {/* File Upload Area */}
              <div className="relative">
                <input
                  type="file"
                  id="documents"
                  name="documents"
                  multiple
                  onChange={handleFileSelection}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.zip"
                />
                <label
                  htmlFor="documents"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-white/50 hover:bg-white/70 transition-all duration-300 hover:border-blue-400"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-1 text-sm font-medium text-gray-600">
                      <span className="text-blue-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, ZIP (Max 10MB each)</p>
                  </div>
                </label>
              </div>

              {/* Display selected files */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold" style={{ color: '#123458' }}>Selected Files:</h4>
                  <div className="grid gap-3">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl border transition-all duration-200 bg-white/80 hover:bg-white/90"
                        style={{ borderColor: '#e5e7eb' }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <span className="text-2xl">{getFileIcon(file.name)}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate" style={{ color: '#123458' }}>
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {uploadingFiles && uploadProgress[index] !== undefined && (
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="h-1.5 rounded-full transition-all duration-300"
                                  style={{ 
                                    width: `${uploadProgress[index]}%`,
                                    backgroundColor: '#123458'
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium text-gray-600">
                                {uploadProgress[index]}%
                              </span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                            disabled={uploadingFiles}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/alumni")}
                className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-md hover:scale-105"
                style={{ 
                  backgroundColor: '#B8C8D9',
                  color: '#123458'
                }}
                disabled={loading || uploadingFiles}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading || uploadingFiles}
                className={`px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center justify-center ${
                  loading || uploadingFiles ? "opacity-50 cursor-not-allowed transform-none" : ""
                }`}
                style={{ 
                  backgroundColor: '#123458',
                  boxShadow: loading || uploadingFiles ? 'none' : '0 10px 30px -5px rgba(18, 52, 88, 0.3)'
                }}
              >
                {uploadingFiles ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading Files...
                  </>
                ) : loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create Project
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 Your Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;














// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api"; // Import centralized Axios instance
// import { useAuth } from "../../context/AuthContext";
// import { 
//   Rocket, 
//   FileText, 
//   Clock, 
//   Users, 
//   Calendar, 
//   DollarSign, 
//   Upload, 
//   X, 
//   AlertCircle,
//   CheckCircle,
//   ArrowLeft
// } from "lucide-react";

// const CreateProject = () => {
//   const navigate = useNavigate();
//   const { token } = useAuth();
  
//   const [loading, setLoading] = useState(false);
//   const [uploadingFiles, setUploadingFiles] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [project, setProject] = useState({
//     title: "",
//     description: "",
//     requirements: "",
//     duration: "",
//     skills: [],
//     deadline: "",
//     compensation: "Unpaid",
//     documents: [],
//   });
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [uploadProgress, setUploadProgress] = useState({});

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProject({ ...project, [name]: value });
//   };

//   // Handle skills input (comma separated)
//   const handleSkillsChange = (e) => {
//     const skillsArray = e.target.value.split(",").map((skill) => skill.trim());
//     setProject({ ...project, skills: skillsArray });
//   };

//   // Handle file selection
//   const handleFileSelection = (e) => {
//     const files = Array.from(e.target.files);
    
//     // Validate file size (10MB max per file)
//     const maxSize = 10 * 1024 * 1024; // 10MB in bytes
//     const invalidFiles = files.filter(file => file.size > maxSize);
    
//     if (invalidFiles.length > 0) {
//       setError(`Some files exceed the 10MB limit: ${invalidFiles.map(f => f.name).join(', ')}`);
//       return;
//     }
    
//     // Validate file count (max 5 files)
//     if (files.length > 5) {
//       setError("You can upload a maximum of 5 files.");
//       return;
//     }
    
//     setSelectedFiles(files);
//     setError(""); // Clear any previous errors

//     // Reset upload progress
//     const initialProgress = {};
//     files.forEach((file, index) => {
//       initialProgress[index] = 0;
//     });
//     setUploadProgress(initialProgress);
//   };

//   // Upload files to server
//   const uploadFiles = async (files) => {
//     if (!files || files.length === 0) return [];

//     setUploadingFiles(true);

//     try {
//       const uploadPromises = files.map(async (file, index) => {
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('type', 'project-document');

//         // Upload with progress tracking
//         const response = await api.post('/upload', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             'Authorization': `Bearer ${token}`
//           },
//           onUploadProgress: (progressEvent) => {
//             const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//             setUploadProgress(prev => ({
//               ...prev,
//               [index]: progress
//             }));
//           }
//         });

//         return response.data.fileUrl || response.data.url; // Adjust based on your API response
//       });

//       const uploadedUrls = await Promise.all(uploadPromises);
//       setUploadingFiles(false);
//       return uploadedUrls;
//     } catch (error) {
//       setUploadingFiles(false);
//       console.error("File upload error:", error);
//       throw new Error(error.response?.data?.message || "Failed to upload files. Please try again.");
//     }
//   };

//   // Remove selected file
//   const removeFile = (index) => {
//     const newFiles = selectedFiles.filter((_, i) => i !== index);
//     setSelectedFiles(newFiles);

//     // Update progress object
//     const newProgress = {};
//     newFiles.forEach((file, i) => {
//       newProgress[i] = uploadProgress[i] || 0;
//     });
//     setUploadProgress(newProgress);
//   };

//   // Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       // First upload files if any are selected
//       let documentUrls = [];
//       if (selectedFiles.length > 0) {
//         documentUrls = await uploadFiles(selectedFiles);
//       }

//       // Create project with uploaded document URLs
//       const projectData = {
//         ...project,
//         documents: documentUrls,
//         skills: project.skills.filter(skill => skill.trim() !== ""), // Remove empty skills
//       };

//       // Make API call to create project
//       const response = await api.post('/projects', projectData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       setLoading(false);
//       setSuccess("Project created successfully! 🎉");
      
//       // Reset form
//       setProject({
//         title: "",
//         description: "",
//         requirements: "",
//         duration: "",
//         skills: [],
//         deadline: "",
//         compensation: "Unpaid",
//         documents: [],
//       });
//       setSelectedFiles([]);
//       setUploadProgress({});
      
//       // Navigate after a short delay to show success message
//       setTimeout(() => navigate("/alumni"), 2000);
      
//     } catch (err) {
//       console.error("Project creation error:", err);
//       const errorMessage = err.response?.data?.message || err.message || "Failed to create project. Please try again.";
//       setError(errorMessage);
//       setLoading(false);
//     }
//   };

//   // Format file size for display
//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   // Get file type icon
//   const getFileIcon = (fileName) => {
//     const extension = fileName.split(".").pop().toLowerCase();
//     const icons = {
//       pdf: "📄",
//       doc: "📝",
//       docx: "📝",
//       zip: "📦",
//     };
//     return icons[extension] || "📎";
//   };

//   return (
//     <div 
//       className="min-h-screen py-12 px-4 relative overflow-hidden"
//       style={{ backgroundColor: '#f4f7fa' }}
//     >
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div 
//           className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10 animate-pulse"
//           style={{ backgroundColor: '#B8C8D9' }}
//         ></div>
//         <div 
//           className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10 animate-pulse"
//           style={{ backgroundColor: '#D4C9BE' }}
//         ></div>
//         <div 
//           className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full opacity-5 animate-bounce"
//           style={{ backgroundColor: '#123458' }}
//         ></div>
//         <div 
//           className="absolute bottom-1/3 left-1/3 w-24 h-24 rounded-full opacity-5 animate-pulse"
//           style={{ backgroundColor: '#B8C8D9' }}
//         ></div>
//       </div>

//       <div className="container mx-auto relative z-10">
//         {/* Header section */}
//         <div className="text-center mb-8">
//           <div 
//             className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg"
//             style={{ backgroundColor: '#123458' }}
//           >
//             <Rocket className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-4xl font-bold mb-2" style={{ color: '#123458' }}>
//             Create New Project
//           </h1>
//           <p className="text-gray-600">Share your project with talented students</p>
//         </div>

//         <div className="max-w-4xl mx-auto">
//           <div 
//             className="backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl p-8 border border-white/20"
//             style={{ 
//               boxShadow: '0 25px 50px -12px rgba(18, 52, 88, 0.15)',
//             }}
//           >
//             {/* Alert messages */}
//             {error && (
//               <div 
//                 className="flex items-center p-4 mb-6 rounded-2xl"
//                 style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
//               >
//                 <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
//                 <span className="text-red-700 text-sm font-medium">{error}</span>
//               </div>
//             )}

//             {success && (
//               <div 
//                 className="flex items-center p-4 mb-6 rounded-2xl"
//                 style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
//               >
//                 <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
//                 <span className="text-green-700 text-sm font-medium">{success}</span>
//               </div>
//             )}

//             <form onSubmit={handleSubmit}>
//               <div className="space-y-8">
//                 {/* Project Title */}
//                 <div className="space-y-2">
//                   <label htmlFor="title" className="block text-sm font-semibold" style={{ color: '#123458' }}>
//                     Project Title *
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//                       <FileText className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                     </div>
//                     <input
//                       type="text"
//                       id="title"
//                       name="title"
//                       value={project.title}
//                       onChange={handleChange}
//                       className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
//                       placeholder="Enter an engaging project title..."
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Project Description */}
//                 <div className="space-y-2">
//                   <label htmlFor="description" className="block text-sm font-semibold" style={{ color: '#123458' }}>
//                     Project Description *
//                   </label>
//                   <textarea
//                     id="description"
//                     name="description"
//                     value={project.description}
//                     onChange={handleChange}
//                     rows="5"
//                     className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50 resize-none"
//                     placeholder="Describe your project goals, objectives, and what students will learn..."
//                     required
//                   />
//                 </div>

//                 {/* Project Requirements */}
//                 <div className="space-y-2">
//                   <label htmlFor="requirements" className="block text-sm font-semibold" style={{ color: '#123458' }}>
//                     Project Requirements *
//                   </label>
//                   <textarea
//                     id="requirements"
//                     name="requirements"
//                     value={project.requirements}
//                     onChange={handleChange}
//                     rows="4"
//                     className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50 resize-none"
//                     placeholder="List the specific requirements and qualifications needed..."
//                     required
//                   />
//                 </div>

//                 {/* Duration and Skills Row */}
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label htmlFor="duration" className="block text-sm font-semibold" style={{ color: '#123458' }}>
//                       Duration *
//                     </label>
//                     <div className="relative group">
//                       <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//                         <Clock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                       </div>
//                       <input
//                         type="text"
//                         id="duration"
//                         name="duration"
//                         placeholder="e.g., 2 months, 6 weeks"
//                         value={project.duration}
//                         onChange={handleChange}
//                         className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label htmlFor="skills" className="block text-sm font-semibold" style={{ color: '#123458' }}>
//                       Required Skills *
//                     </label>
//                     <div className="relative group">
//                       <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//                         <Users className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                       </div>
//                       <input
//                         type="text"
//                         id="skills"
//                         name="skills"
//                         placeholder="e.g., React, Node.js, MongoDB"
//                         value={project.skills.join(", ")}
//                         onChange={handleSkillsChange}
//                         className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Deadline and Compensation Row */}
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label htmlFor="deadline" className="block text-sm font-semibold" style={{ color: '#123458' }}>
//                       Application Deadline
//                     </label>
//                     <div className="relative group">
//                       <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//                         <Calendar className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                       </div>
//                       <input
//                         type="date"
//                         id="deadline"
//                         name="deadline"
//                         value={project.deadline}
//                         onChange={handleChange}
//                         className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label htmlFor="compensation" className="block text-sm font-semibold" style={{ color: '#123458' }}>
//                       Compensation
//                     </label>
//                     <div className="relative group">
//                       <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//                         <DollarSign className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                       </div>
//                       <select
//                         id="compensation"
//                         name="compensation"
//                         value={project.compensation}
//                         onChange={handleChange}
//                         className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 bg-white/50 appearance-none"
//                       >
//                         <option value="Unpaid">Unpaid</option>
//                         <option value="Paid">Paid</option>
//                         <option value="Certificate">Certificate</option>
//                         <option value="Experience">Experience</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 {/* File Upload Section */}
//                 <div className="space-y-4">
//                   <label htmlFor="documents" className="block text-sm font-semibold" style={{ color: '#123458' }}>
//                     Supporting Documents
//                     <span className="text-gray-500 font-normal text-sm ml-2">(optional)</span>
//                   </label>
                  
//                   <div 
//                     className="border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 hover:border-solid hover:border-blue-300 hover:bg-blue-50/50 group cursor-pointer"
//                     style={{ borderColor: '#d1d5db' }}
//                     onClick={() => document.getElementById('documents').click()}
//                   >
//                     <div className="flex flex-col items-center">
//                       <div 
//                         className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-300 group-hover:scale-110"
//                         style={{ backgroundColor: '#123458' }}
//                       >
//                         <Upload className="w-8 h-8 text-white" />
//                       </div>
//                       <h3 className="text-lg font-semibold mb-2" style={{ color: '#123458' }}>
//                         Drop files here or click to browse
//                       </h3>
//                       <p className="text-gray-500 text-sm mb-4">
//                         Accepted formats: PDF, DOC, DOCX, ZIP
//                       </p>
//                       <p className="text-gray-400 text-xs">
//                         Maximum 10MB each, up to 5 files
//                       </p>
//                     </div>
//                     <input
//                       type="file"
//                       id="documents"
//                       name="documents"
//                       multiple
//                       onChange={handleFileSelection}
//                       className="hidden"
//                       accept=".pdf,.doc,.docx,.zip"
//                     />
//                   </div>

//                   {/* Display selected files */}
//                   {selectedFiles.length > 0 && (
//                     <div className="space-y-4">
//                       <h4 className="font-semibold text-lg" style={{ color: '#123458' }}>
//                         Selected Files ({selectedFiles.length})
//                       </h4>
//                       <div className="space-y-3">
//                         {selectedFiles.map((file, index) => (
//                           <div
//                             key={index}
//                             className="flex items-center justify-between p-4 rounded-2xl border-2 bg-white/60 transition-all duration-300 hover:shadow-md"
//                             style={{ borderColor: '#e5e7eb' }}
//                           >
//                             <div className="flex items-center space-x-4">
//                               <span className="text-3xl">{getFileIcon(file.name)}</span>
//                               <div>
//                                 <p className="font-medium truncate max-w-xs" style={{ color: '#123458' }}>
//                                   {file.name}
//                                 </p>
//                                 <p className="text-sm text-gray-500">
//                                   {formatFileSize(file.size)}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="flex items-center space-x-4">
//                               {uploadingFiles && uploadProgress[index] !== undefined && (
//                                 <div className="flex items-center space-x-3">
//                                   <div className="w-20 bg-gray-200 rounded-full h-2">
//                                     <div
//                                       className="h-2 rounded-full transition-all duration-300"
//                                       style={{ 
//                                         width: `${uploadProgress[index]}%`,
//                                         backgroundColor: '#123458'
//                                       }}
//                                     />
//                                   </div>
//                                   <span className="text-sm font-medium" style={{ color: '#123458' }}>
//                                     {uploadProgress[index]}%
//                                   </span>
//                                 </div>
//                               )}
//                               <button
//                                 type="button"
//                                 onClick={() => removeFile(index)}
//                                 className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-all duration-200"
//                                 disabled={uploadingFiles}
//                               >
//                                 <X className="w-4 h-4" />
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex items-center justify-between pt-8 border-t border-gray-200">
//                   <button
//                     type="button"
//                     onClick={() => navigate("/alumni")}
//                     className="inline-flex items-center px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-md hover:scale-105"
//                     style={{
//                       backgroundColor: '#B8C8D9',
//                       color: '#123458'
//                     }}
//                     disabled={loading || uploadingFiles}
//                   >
//                     <ArrowLeft className="w-5 h-5 mr-2" />
//                     Cancel
//                   </button>
                  
//                   <button
//                     type="submit"
//                     disabled={loading || uploadingFiles}
//                     className={`inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 ${
//                       loading || uploadingFiles ? "opacity-50 cursor-not-allowed transform-none" : ""
//                     }`}
//                     style={{
//                       backgroundColor: loading || uploadingFiles ? '#6b7280' : '#123458',
//                       boxShadow: '0 10px 30px -5px rgba(18, 52, 88, 0.3)'
//                     }}
//                   >
//                     {uploadingFiles ? (
//                       <>
//                         <Upload className="w-5 h-5 mr-2 animate-pulse" />
//                         Uploading Files...
//                       </>
//                     ) : loading ? (
//                       <>
//                         <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                         Creating...
//                       </>
//                     ) : (
//                       <>
//                         <Rocket className="w-5 h-5 mr-2" />
//                         Create Project
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-8">
//           <p className="text-sm text-gray-500">
//             © 2024 Your Platform. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateProject;
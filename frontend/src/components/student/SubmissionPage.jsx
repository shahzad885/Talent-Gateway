// // frontend/src/components/stuudent/SubmissionPage.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import api from "../../services/api";
// import {
//   FaUpload,
//   FaSpinner,
//   FaCheckCircle,
//   FaExclamationCircle,
// } from "react-icons/fa";

// const SubmissionPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [submissionData, setSubmissionData] = useState({
//     zipFile: "",
//     description: "",
//   });
//   const [file, setFile] = useState(null);
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   useEffect(() => {
//     const fetchProject = async () => {
//       try {
//         const response = await api.get(`/student/projects/${id}`);
//         setProject(response.data);
//       } catch (err) {
//         setError("Failed to load project details");
//       }
//     };
//     fetchProject();
//   }, [id]);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     const allowedTypes = ["application/zip", "application/x-zip-compressed"];
//     if (selectedFile && allowedTypes.includes(selectedFile.type)) {
//       setFile(selectedFile);
//       setError("");
//     } else {
//       setError("Please select a valid ZIP file");
//       setFile(null);
//     }
//   };

//   const handleDescriptionChange = (e) => {
//     setSubmissionData({ ...submissionData, description: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const formData = new FormData();

//       formData.append("file", file);
//       console.log(formData); // Log the file for debugging
//       const uploadResponse = await api.post("/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const zipFileUrl = uploadResponse.data.url;
//       console.log(zipFileUrl); // Log the URL for debugging
//       const response = await api.post(`/student/submit-project/${id}`, {
//         zipFile: zipFileUrl,
//         description: submissionData.description,
//       });

//       setSuccess("Project submitted successfully!");
//       setTimeout(() => navigate("/student"), 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to submit project");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!project) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <FaSpinner className="animate-spin text-4xl text-blue-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-4">
//         Submit Project: {project.title}
//       </h1>

//       {error && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex items-center">
//           <FaExclamationCircle className="mr-2" />
//           {error}
//         </div>
//       )}
//       {success && (
//         <div className="mb-4 p-3 bg-green-100 text-green-700 rounded flex items-center">
//           <FaCheckCircle className="mr-2" />
//           {success}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Project ZIP File
//           </label>
//           <div className="flex items-center space-x-2">
//             <input
//               type="file"
//               accept=".zip"
//               onChange={handleFileChange}
//               disabled={loading}
//               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//             <FaUpload className="text-blue-500" />
//           </div>
//           <p className="mt-1 text-xs text-gray-500">
//             Please upload your project files as a ZIP archive
//           </p>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Description
//           </label>
//           <textarea
//             value={submissionData.description}
//             onChange={handleDescriptionChange}
//             disabled={loading}
//             rows={4}
//             className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
//             placeholder="Provide a brief description of your submission"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading || !file}
//           className={`w-full py-2 px-4 rounded-md text-white font-semibold flex items-center justify-center space-x-2 ${
//             loading || !file
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-blue-500 hover:bg-blue-600"
//           }`}
//         >
//           {loading ? (
//             <>
//               <FaSpinner className="animate-spin" />
//               <span>Submitting...</span>
//             </>
//           ) : (
//             <span>Submit Project</span>
//           )}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SubmissionPage;


// frontend/src/components/stuudent/SubmissionPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../services/api";
import {
  FaUpload,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const SubmissionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submissionData, setSubmissionData] = useState({
    zipFile: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/student/projects/${id}`);
        setProject(response.data);
      } catch (err) {
        setError("Failed to load project details");
      }
    };
    fetchProject();
  }, [id]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ["application/zip", "application/x-zip-compressed"];
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid ZIP file");
      setFile(null);
    }
  };

  const handleDescriptionChange = (e) => {
    setSubmissionData({ ...submissionData, description: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();

      formData.append("file", file);
      console.log(formData); // Log the file for debugging
      const uploadResponse = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const zipFileUrl = uploadResponse.data.url;
      console.log(zipFileUrl); // Log the URL for debugging
      const response = await api.post(`/student/submit-project/${id}`, {
        zipFile: zipFileUrl,
        description: submissionData.description,
      });

      setSuccess("Project submitted successfully!");
      setTimeout(() => navigate("/student"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit project");
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor: '#f4f7fa' }}>
        <FaSpinner className="animate-spin text-4xl" style={{ color: '#123458' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#f4f7fa' }}>
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border" style={{ borderColor: '#B8C8D9' }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#123458' }}>
            Submit Project
          </h1>
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#B8C8D9', backgroundColor: 'rgba(184, 200, 217, 0.3)' }}>
            <h2 className="text-xl font-semibold" style={{ color: '#123458' }}>
              {project.title}
            </h2>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg flex items-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <FaExclamationCircle className="mr-3 text-lg" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 rounded-lg flex items-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <FaCheckCircle className="mr-3 text-lg" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-semibold mb-3" style={{ color: '#123458' }}>
              Project ZIP File
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                disabled={loading}
                className="block w-full text-sm rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-0 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold"
                style={{
                  borderColor: '#B8C8D9',
                  'file:backgroundColor': '#D4C9BE',
                  'file:color': '#123458'
                }}
              />
              <FaUpload 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg pointer-events-none" 
                style={{ color: '#123458' }} 
              />
            </div>
            <p className="mt-2 text-xs" style={{ color: '#6b7280' }}>
              Please upload your project files as a ZIP archive (Max 50MB)
            </p>
            {file && (
              <div className="mt-3 p-3 rounded-lg flex items-center" style={{ backgroundColor: 'rgba(212, 201, 190, 0.3)' }}>
                <FaCheckCircle className="mr-2" style={{ color: '#16a34a' }} />
                <span className="text-sm font-medium" style={{ color: '#123458' }}>
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3" style={{ color: '#123458' }}>
              Submission Description
            </label>
            <textarea
              value={submissionData.description}
              onChange={handleDescriptionChange}
              disabled={loading}
              rows={5}
              className="w-full p-4 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-0 disabled:opacity-50"
              style={{
                borderColor: '#B8C8D9',
                backgroundColor: loading ? '#f9fafb' : 'white'
              }}
              placeholder="Provide a detailed description of your submission, including any special instructions or notes..."
              onFocus={(e) => e.target.style.borderColor = '#123458'}
              onBlur={(e) => e.target.style.borderColor = '#B8C8D9'}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full py-4 px-6 rounded-lg text-white font-semibold flex items-center justify-center space-x-3 transition-all duration-200 transform ${
                loading || !file
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-[1.02] hover:shadow-lg"
              }`}
              style={{
                backgroundColor: loading || !file ? '#9ca3af' : '#123458'
              }}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-lg" />
                  <span>Submitting Project...</span>
                </>
              ) : (
                <>
                  <FaUpload className="text-lg" />
                  <span>Submit Project</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t" style={{ borderColor: '#B8C8D9' }}>
          <div className="text-center">
            <p className="text-sm" style={{ color: '#6b7280' }}>
              Need help? Contact your instructor or check the 
              <span className="font-semibold ml-1" style={{ color: '#123458' }}>
                submission guidelines
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionPage;
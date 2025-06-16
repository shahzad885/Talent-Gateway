// // frontend/src/components/student/ProjectDetail.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../../services/api";
// import {
//   FaArrowLeft,
//   FaFileAlt,
//   FaClock,
//   FaMoneyBill,
//   FaUser,
// } from "react-icons/fa";

// const ProjectDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showApplyModal, setShowApplyModal] = useState(false);
//   const [applicationData, setApplicationData] = useState({
//     coverLetter: "",
//     resume: "",
//   });

//   useEffect(() => {
//     const fetchProject = async () => {
//       try {
//         const response = await api.get(`/student/projects/${id}`);
//         setProject(response.data.data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching project:", err);
//         setError("Failed to load project details");
//         setLoading(false);
//       }
//     };

//     fetchProject();
//   }, [id]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setApplicationData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleApply = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await api.post(
//         `/student/apply/project/${id}`,
//         applicationData
//       );
//       setShowApplyModal(false);
//       alert("Application submitted successfully!");
//       navigate("/student/applications"); // Redirect to applications page
//     } catch (err) {
//       console.error("Error applying to project:", err.response?.data || err);
//       setError(err.response?.data?.message || "Failed to submit application");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500">Loading project details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-red-500">{error}</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 text-indigo-600 hover:text-indigo-800"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   if (!project) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500">Project not found</p>
//       </div>
//     );
//   }

//   const deadline = new Date(project.deadline);
//   const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));

//   return (
//     <div className="max-w-4xl mx-auto py-8">
//       {/* Back Button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
//       >
//         <FaArrowLeft className="mr-2" /> Back to Projects
//       </button>

//       {/* Project Header */}
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
//         <div className="flex items-center text-gray-600 mb-4">
//           <FaUser className="mr-2" />
//           <span>Posted by: {project.alumni?.name || "Alumni"}</span>
//         </div>
//         <div className="flex flex-wrap gap-4">
//           <div className="flex items-center">
//             <FaClock className="mr-2 text-gray-500" />
//             <span>Duration: {project.duration}</span>
//           </div>
//           <div className="flex items-center">
//             <FaMoneyBill className="mr-2 text-gray-500" />
//             <span>Compensation: {project.compensation}</span>
//           </div>
//           <div
//             className={`flex items-center px-2 py-1 rounded ${
//               daysLeft < 3
//                 ? "bg-red-100 text-red-800"
//                 : daysLeft < 7
//                 ? "bg-yellow-100 text-yellow-800"
//                 : "bg-green-100 text-green-800"
//             }`}
//           >
//             {daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}
//           </div>
//         </div>
//       </div>

//       {/* Project Details */}
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4">Project Details</h2>
//         <div className="space-y-4">
//           <div>
//             <h3 className="text-lg font-medium">Description</h3>
//             <p className="text-gray-600">{project.description}</p>
//           </div>
//           <div>
//             <h3 className="text-lg font-medium">Requirements</h3>
//             <p className="text-gray-600">{project.requirements}</p>
//           </div>
//           <div>
//             <h3 className="text-lg font-medium">Required Skills</h3>
//             <div className="flex flex-wrap gap-2 mt-2">
//               {console.log(project)}
//               {project.skills.map((skill, index) => (
//                 <span
//                   key={index}
//                   className="bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded"
//                 >
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Documents */}
//       {project.documents?.length > 0 && (
//         <div className="bg-white rounded-lg shadow p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">Supporting Documents</h2>
//           <div className="space-y-2">
//             {project.documents.map((doc, index) => (
//               <a
//                 key={index}
//                 href={doc}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex items-center text-indigo-600 hover:text-indigo-800"
//               >
//                 <FaFileAlt className="mr-2" />
//                 Document {index + 1}
//               </a>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Apply Button */}
//       {project.status === "Open" && !project.hasApplied && daysLeft > 0 && (
//         <div className="text-right">
//           <button
//             onClick={() => setShowApplyModal(true)}
//             className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
//           >
//             Apply Now
//           </button>
//         </div>
//       )}
//       {project.hasApplied && (
//         <div className="flex justify-end">
//           <span className="px-6 py-2 bg-gray-200 text-gray-700 rounded">
//             Already Applied
//           </span>
//         </div>
//       )}

//       {/* Application Modal */}
//       {showApplyModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
//           <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
//             <div className="mt-3">
//               <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
//                 Apply for {project.title}
//               </h3>
//               <form onSubmit={handleApply}>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Cover Letter
//                   </label>
//                   <textarea
//                     name="coverLetter"
//                     value={applicationData.coverLetter}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                     rows="4"
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Resume URL
//                   </label>
//                   <input
//                     type="url"
//                     name="resume"
//                     value={applicationData.resume}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                     placeholder="https://example.com/resume.pdf"
//                     required
//                   />
//                 </div>
//                 <div className="flex justify-end gap-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowApplyModal(false)}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
//                   >
//                     Submit Application
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectDetail;



// frontend/src/components/student/ProjectDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  FaArrowLeft,
  FaFileAlt,
  FaClock,
  FaMoneyBill,
  FaUser,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimes,
  FaExclamationTriangle,
  FaGraduationCap,
  FaTools,
} from "react-icons/fa";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    resume: "",
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/student/projects/${id}`);
        setProject(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project details");
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        `/student/apply/project/${id}`,
        applicationData
      );
      setShowApplyModal(false);
      alert("Application submitted successfully!");
      navigate("/student/applications");
    } catch (err) {
      console.error("Error applying to project:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to submit application");
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#f4f7fa' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: '#123458' }}></div>
          <p className="text-gray-600 text-lg">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#f4f7fa' }}
      >
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
          <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
          <p className="text-red-600 text-lg mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 hover:transform hover:scale-105"
            style={{ backgroundColor: '#123458' }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#f4f7fa' }}
      >
        <div className="text-center bg-white rounded-2xl shadow-xl p-8">
          <p className="text-gray-500 text-lg">Project not found</p>
        </div>
      </div>
    );
  }

  const deadline = new Date(project.deadline);
  const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));

  const getDeadlineStatus = () => {
    if (daysLeft <= 0) return { color: '#ef4444', bg: '#fef2f2', text: 'Deadline passed', icon: FaTimes };
    if (daysLeft <= 3) return { color: '#f59e0b', bg: '#fffbeb', text: `${daysLeft} days left`, icon: FaExclamationTriangle };
    if (daysLeft <= 7) return { color: '#eab308', bg: '#fefce8', text: `${daysLeft} days left`, icon: FaClock };
    return { color: '#10b981', bg: '#f0fdf4', text: `${daysLeft} days left`, icon: FaCheckCircle };
  };

  const deadlineStatus = getDeadlineStatus();

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: '#f4f7fa' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white px-6 py-3 rounded-xl font-medium mb-8 transition-all duration-200 hover:transform hover:scale-105 shadow-lg"
          style={{ backgroundColor: '#123458' }}
        >
          <FaArrowLeft className="mr-3" /> Back to Projects
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4" style={{ borderColor: '#123458' }}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-4 text-gray-800">{project.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <div className="flex items-center px-4 py-2 rounded-lg mr-4" style={{ backgroundColor: '#B8C8D9' }}>
                      <FaGraduationCap className="mr-2" />
                      <span className="font-medium">Posted by: {project.alumni?.name || "Alumni"}</span>
                    </div>
                  </div>
                </div>
                <div 
                  className="flex items-center px-4 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: deadlineStatus.bg, color: deadlineStatus.color }}
                >
                  <deadlineStatus.icon className="mr-2" />
                  {deadlineStatus.text}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center p-4 rounded-xl" style={{ backgroundColor: 'rgba(212, 201, 190, 0.3)' }}>
                  <FaClock className="mr-3 text-2xl" style={{ color: '#123458' }} />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-800">{project.duration}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 rounded-xl" style={{ backgroundColor: 'rgba(212, 201, 190, 0.3)' }}>
                  <FaMoneyBill className="mr-3 text-2xl" style={{ color: '#123458' }} />
                  <div>
                    <p className="text-sm text-gray-600">Compensation</p>
                    <p className="font-semibold text-gray-800">{project.compensation}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: '#123458' }}>
                <FaFileAlt className="mr-3" />
                Project Details
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Description</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{project.description}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Requirements</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{project.requirements}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                    <FaTools className="mr-2" />
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {project.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-lg text-white font-medium shadow-md hover:transform hover:scale-105 transition-all duration-200"
                        style={{ backgroundColor: '#123458' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            {project.documents?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: '#123458' }}>
                  <FaFileAlt className="mr-3" />
                  Supporting Documents
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 border-2 border-dashed rounded-xl transition-all duration-200 hover:transform hover:scale-105"
                      style={{ 
                        borderColor: '#B8C8D9',
                        backgroundColor: 'rgba(184, 200, 217, 0.1)'
                      }}
                    >
                      <FaFileAlt className="mr-3 text-xl" style={{ color: '#123458' }} />
                      <span className="font-medium text-gray-700">Document {index + 1}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Status Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#123458' }}>Application Status</h3>
              
              {project.hasApplied ? (
                <div className="text-center p-6 rounded-xl" style={{ backgroundColor: 'rgba(184, 200, 217, 0.3)' }}>
                  <FaCheckCircle className="text-4xl mx-auto mb-3" style={{ color: '#10b981' }} />
                  <p className="font-semibold text-gray-700">Already Applied</p>
                  <p className="text-sm text-gray-600 mt-2">Your application is under review</p>
                </div>
              ) : project.status === "Open" && daysLeft > 0 ? (
                <div className="text-center">
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-200 hover:transform hover:scale-105 shadow-lg"
                    style={{ backgroundColor: '#123458' }}
                  >
                    Apply Now
                  </button>
                  <p className="text-sm text-gray-600 mt-3">Click to submit your application</p>
                </div>
              ) : (
                <div className="text-center p-6 rounded-xl bg-red-50">
                  <FaTimes className="text-4xl text-red-500 mx-auto mb-3" />
                  <p className="font-semibold text-red-700">Applications Closed</p>
                </div>
              )}
            </div>

            {/* Project Info Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#123458' }}>Quick Info</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-3" style={{ color: '#123458' }} />
                  <div>
                    <p className="text-sm text-gray-600">Deadline</p>
                    <p className="font-semibold">{deadline.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaUser className="mr-3" style={{ color: '#123458' }} />
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold">{project.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: '#123458' }}>
                  Apply for {project.title}
                </h3>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleApply} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    name="coverLetter"
                    value={applicationData.coverLetter}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{ 
                      borderColor: '#B8C8D9',
                      focusRingColor: '#123458'
                    }}
                    rows="6"
                    placeholder="Tell us why you're the perfect fit for this project..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resume URL *
                  </label>
                  <input
                    type="url"
                    name="resume"
                    value={applicationData.resume}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{ 
                      borderColor: '#B8C8D9',
                      focusRingColor: '#123458'
                    }}
                    placeholder="https://example.com/your-resume.pdf"
                    required
                  />
                </div>
                
                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-6 py-3 font-medium rounded-xl border-2 transition-all duration-200 hover:transform hover:scale-105"
                    style={{ 
                      borderColor: '#B8C8D9',
                      color: '#123458'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 font-bold text-white rounded-xl transition-all duration-200 hover:transform hover:scale-105 shadow-lg"
                    style={{ backgroundColor: '#123458' }}
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
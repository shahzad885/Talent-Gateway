// // frontend/src/components/student/ApplicationDetail.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../../services/api";
// import { FaArrowLeft, FaFileAlt, FaClock, FaMoneyBill } from "react-icons/fa";

// const ApplicationDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [application, setApplication] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchApplication = async () => {
//       try {
//         const response = await api.get(`/student/applications/${id}`);
//         if (response.data.success) {
//           setApplication(response.data.data);
//         } else {
//           setError(response.data.message);
//         }
//         setLoading(false);
//       } catch (err) {
//         setError(
//           err.response?.data?.message || "Failed to load application details"
//         );
//         setLoading(false);
//       }
//     };

//     fetchApplication();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500">Loading application details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-red-500">{error}</p>
//         <button
//           onClick={() => navigate(-1)}
//           className="mt-4 text-indigo-600 hover:text-indigo-800 flex items-center justify-center mx-auto"
//         >
//           <FaArrowLeft className="mr-2" /> Go Back
//         </button>
//       </div>
//     );
//   }

//   if (!application) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500">Application not found</p>
//       </div>
//     );
//   }

//   // Determine the opportunity type and set appropriate labels and routes
//   const isProject = application.opportunityType === "Project";
//   const opportunityTypeLabel = isProject ? "Project" : "Internship";
//   const detailRoute = isProject
//     ? `/student/projects/${application.opportunity._id}`
//     : `/student/internships/${application.opportunity._id}`;

//   return (
//     <div className="max-w-4xl mx-auto py-8">
//       {/* Back Button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
//       >
//         <FaArrowLeft className="mr-2" /> Back to Applications
//       </button>

//       {/* Application Header */}
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <h1 className="text-3xl font-bold mb-4">
//           {opportunityTypeLabel} Application: {application.opportunity.title}
//         </h1>
//         <div className="flex flex-wrap gap-4">
//           <div className="flex items-center">
//             <FaClock className="mr-2 text-gray-500" />
//             <span>Duration: {application.opportunity.duration}</span>
//           </div>
//           <div className="flex items-center">
//             <FaMoneyBill className="mr-2 text-gray-500" />
//             <span>Compensation: {application.opportunity.compensation}</span>
//           </div>
//           <div
//             className={`flex items-center px-2 py-1 rounded ${
//               application.status === "Pending"
//                 ? "bg-yellow-100 text-yellow-800"
//                 : application.status === "Accepted"
//                 ? "bg-green-100 text-green-800"
//                 : "bg-red-100 text-red-800"
//             }`}
//           >
//             Status: {application.status}
//           </div>
//         </div>
//       </div>

//       {/* Application Details */}
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4">Application Details</h2>
//         <div className="space-y-6">
//           {/* Opportunity Information */}
//           <div>
//             <h3 className="text-lg font-medium mb-2">
//               {opportunityTypeLabel} Information
//             </h3>
//             <div className="space-y-2 text-gray-600">
//               <p>
//                 <span className="font-medium">Title:</span>{" "}
//                 {application.opportunity.title}
//               </p>
//               <p>
//                 <span className="font-medium">Description:</span>{" "}
//                 {application.opportunity.description}
//               </p>
//               <div>
//                 <span className="font-medium">Required Skills:</span>
//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {application.opportunity.skills.map((skill, index) => (
//                     <span
//                       key={index}
//                       className="bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded"
//                     >
//                       {skill}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Application Submission */}
//           <div>
//             <h3 className="text-lg font-medium mb-2">Your Submission</h3>
//             <div className="space-y-2 text-gray-600">
//               <p>
//                 <span className="font-medium">Submission Date:</span>{" "}
//                 {new Date(application.submissionDate).toLocaleDateString()}
//               </p>
//               <div>
//                 <span className="font-medium">Cover Letter:</span>
//                 <div className="mt-1 p-3 bg-gray-100 rounded">
//                   <p>{application.coverLetter}</p>
//                 </div>
//               </div>
//               <p>
//                 <span className="font-medium">Resume:</span>{" "}
//                 <a
//                   href={application.resume}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-indigo-600 hover:text-indigo-800 flex items-center"
//                 >
//                   <FaFileAlt className="mr-2" /> View Resume
//                 </a>
//               </p>
//             </div>
//           </div>

//           {/* Feedback (if available) */}
//           {application.feedback && (
//             <div>
//               <h3 className="text-lg font-medium mb-2">Feedback</h3>
//               <p className="text-gray-600 p-3 bg-gray-100 rounded">
//                 {application.feedback}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-end gap-4">
//         <button
//           onClick={() => navigate(detailRoute)}
//           className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//         >
//           View {opportunityTypeLabel}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ApplicationDetail;


// frontend/src/components/student/ApplicationDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { FaArrowLeft, FaFileAlt, FaClock, FaMoneyBill, FaUser, FaCalendarAlt, FaEnvelope, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await api.get(`/student/applications/${id}`);
        if (response.data.success) {
          setApplication(response.data.data);
        } else {
          setError(response.data.message);
        }
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load application details"
        );
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f4f7fa' }} className="min-h-screen flex items-center justify-center">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: '#123458' }}></div>
          <p style={{ color: '#123458' }} className="text-lg font-medium">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#f4f7fa' }} className="min-h-screen flex items-center justify-center">
        <div className="text-center py-8 max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-red-500">
            <FaTimesCircle className="text-red-500 text-4xl mx-auto mb-4" />
            <p className="text-red-600 text-lg mb-6">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center mx-auto px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-lg"
              style={{ backgroundColor: '#123458' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#0f2847'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#123458'}
            >
              <FaArrowLeft className="mr-2" /> Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div style={{ backgroundColor: '#f4f7fa' }} className="min-h-screen flex items-center justify-center">
        <div className="text-center py-8">
          <p style={{ color: '#123458' }} className="text-lg">Application not found</p>
        </div>
      </div>
    );
  }

  // Determine the opportunity type and set appropriate labels and routes
  const isProject = application.opportunityType === "Project";
  const opportunityTypeLabel = isProject ? "Project" : "Internship";
  const detailRoute = isProject
    ? `/student/projects/${application.opportunity._id}`
    : `/student/internships/${application.opportunity._id}`;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <FaCheckCircle className="text-green-600 text-lg" />;
      case 'Rejected':
        return <FaTimesCircle className="text-red-600 text-lg" />;
      default:
        return <FaHourglassHalf className="text-yellow-600 text-lg" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-50 text-green-800 border border-green-200';
      case 'Rejected':
        return 'bg-red-50 text-red-800 border border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-800 border border-yellow-200';
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f7fa' }} className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-8 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:shadow-md"
          style={{ backgroundColor: '#B8C8D9', color: '#123458' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#a3b5c7'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#B8C8D9'}
        >
          <FaArrowLeft className="mr-2" /> Back to Applications
        </button>

        {/* Application Header Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-l-4" style={{ borderColor: '#123458' }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 style={{ color: '#123458' }} className="text-4xl font-bold mb-2 leading-tight">
                {application.opportunity.title}
              </h1>
              <div className="flex items-center mb-4">
                <span className="px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: '#D4C9BE', color: '#123458' }}>
                  {opportunityTypeLabel} Application
                </span>
              </div>
            </div>
            <div className={`flex items-center px-4 py-3 rounded-xl font-semibold ${getStatusStyle(application.status)}`}>
              {getStatusIcon(application.status)}
              <span className="ml-2">{application.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center p-4 rounded-xl" style={{ backgroundColor: '#f8f9fb' }}>
              <FaClock className="mr-3 text-2xl" style={{ color: '#123458' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#123458' }}>Duration</p>
                <p className="text-lg font-semibold" style={{ color: '#123458' }}>{application.opportunity.duration}</p>
              </div>
            </div>
            <div className="flex items-center p-4 rounded-xl" style={{ backgroundColor: '#f8f9fb' }}>
              <FaMoneyBill className="mr-3 text-2xl" style={{ color: '#123458' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#123458' }}>Compensation</p>
                <p className="text-lg font-semibold" style={{ color: '#123458' }}>{application.opportunity.compensation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Opportunity Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Opportunity Information Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 style={{ color: '#123458' }} className="text-2xl font-bold mb-6 flex items-center">
                <FaUser className="mr-3" />
                {opportunityTypeLabel} Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#123458' }}>Description</h3>
                  <p className="text-gray-700 leading-relaxed p-4 rounded-xl" style={{ backgroundColor: '#f8f9fb' }}>
                    {application.opportunity.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#123458' }}>Required Skills</h3>
                  <div className="flex flex-wrap gap-3">
                    {application.opportunity.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                        style={{ backgroundColor: '#B8C8D9', color: '#123458' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Application Submission Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 style={{ color: '#123458' }} className="text-2xl font-bold mb-6 flex items-center">
                <FaEnvelope className="mr-3" />
                Your Submission
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center p-4 rounded-xl" style={{ backgroundColor: '#f8f9fb' }}>
                  <FaCalendarAlt className="mr-3 text-xl" style={{ color: '#123458' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#123458' }}>Submission Date</p>
                    <p className="text-lg font-semibold" style={{ color: '#123458' }}>
                      {new Date(application.submissionDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#123458' }}>Cover Letter</h3>
                  <div className="p-6 rounded-xl border-2 border-dashed" style={{ borderColor: '#D4C9BE', backgroundColor: '#fefefe' }}>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{application.coverLetter}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: '#123458' }}>Resume</h3>
                  <a
                    href={application.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg group"
                    style={{ backgroundColor: '#D4C9BE', color: '#123458' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#c8bdb0'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#D4C9BE'}
                  >
                    <FaFileAlt className="mr-2 group-hover:scale-110 transition-transform" />
                    View Resume
                  </a>
                </div>
              </div>
            </div>

            {/* Feedback Card */}
            {application.feedback && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 style={{ color: '#123458' }} className="text-2xl font-bold mb-6">Feedback</h2>
                <div className="p-6 rounded-xl border-l-4" style={{ backgroundColor: '#f8f9fb', borderColor: '#123458' }}>
                  <p className="text-gray-700 leading-relaxed italic">{application.feedback}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Action Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 style={{ color: '#123458' }} className="text-xl font-bold mb-6">Quick Actions</h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => navigate(detailRoute)}
                  className="w-full px-6 py-4 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                  style={{ backgroundColor: '#123458' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0f2847'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#123458'}
                >
                  <FaFileAlt className="mr-2" />
                  View {opportunityTypeLabel}
                </button>

                {/* Application Status Summary */}
                <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: '#f8f9fb' }}>
                  <h4 className="font-semibold mb-3" style={{ color: '#123458' }}>Application Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span style={{ color: '#123458' }} className="font-medium">{opportunityTypeLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        application.status === 'Accepted' ? 'text-green-600' :
                        application.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'
                      }`}>{application.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Submitted:</span>
                      <span style={{ color: '#123458' }} className="font-medium">
                        {new Date(application.submissionDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
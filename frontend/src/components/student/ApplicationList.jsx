// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import api from "../../services/api";
// import {
//   FaProjectDiagram,
//   FaBriefcase,
//   FaCalendarAlt,
//   FaFileAlt,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaHourglassHalf,
// } from "react-icons/fa";

// const ApplicationList = () => {
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");

//   useEffect(() => {
//     fetchApplications();
//   }, []);

//   const fetchApplications = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const response = await api.get("/student/applications");

//       setApplications(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching applications:", error);
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "Pending":
//         return (
//           <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs flex items-center">
//             <FaHourglassHalf className="mr-1" /> Pending
//           </span>
//         );
//       case "Accepted":
//         return (
//           <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs flex items-center">
//             <FaCheckCircle className="mr-1" /> Accepted
//           </span>
//         );
//       case "Rejected":
//         return (
//           <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs flex items-center">
//             <FaTimesCircle className="mr-1" /> Rejected
//           </span>
//         );
//       case "Withdrawn":
//         return (
//           <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs flex items-center">
//             Withdrawn
//           </span>
//         );
//       default:
//         return (
//           <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
//             {status}
//           </span>
//         );
//     }
//   };

//   const filteredApplications = () => {
//     if (filter === "all") return applications;
//     return applications.filter((app) => {
//       if (filter === "projects") return app.opportunityType === "Project";
//       if (filter === "internships") return app.opportunityType === "Internship";
//       return app.status.toLowerCase() === filter.toLowerCase();
//     });
//   };

//   return (
//     <div className="min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">My Applications</h1>
//       </div>

//       {/* Filter Tabs */}
//       <div className="mb-6 flex flex-wrap">
//         <button
//           onClick={() => setFilter("all")}
//           className={`mr-2 mb-2 px-4 py-2 rounded-md ${
//             filter === "all"
//               ? "bg-indigo-600 text-white"
//               : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//           }`}
//         >
//           All
//         </button>
//         <button
//           onClick={() => setFilter("projects")}
//           className={`mr-2 mb-2 px-4 py-2 rounded-md ${
//             filter === "projects"
//               ? "bg-indigo-600 text-white"
//               : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//           }`}
//         >
//           Projects
//         </button>
//         <button
//           onClick={() => setFilter("internships")}
//           className={`mr-2 mb-2 px-4 py-2 rounded-md ${
//             filter === "internships"
//               ? "bg-indigo-600 text-white"
//               : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//           }`}
//         >
//           Internships
//         </button>
//         <button
//           onClick={() => setFilter("pending")}
//           className={`mr-2 mb-2 px-4 py-2 rounded-md ${
//             filter === "pending"
//               ? "bg-indigo-600 text-white"
//               : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//           }`}
//         >
//           Pending
//         </button>
//         <button
//           onClick={() => setFilter("accepted")}
//           className={`mr-2 mb-2 px-4 py-2 rounded-md ${
//             filter === "accepted"
//               ? "bg-indigo-600 text-white"
//               : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//           }`}
//         >
//           Accepted
//         </button>
//         <button
//           onClick={() => setFilter("rejected")}
//           className={`mr-2 mb-2 px-4 py-2 rounded-md ${
//             filter === "rejected"
//               ? "bg-indigo-600 text-white"
//               : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//           }`}
//         >
//           Rejected
//         </button>
//       </div>

//       {loading ? (
//         <div className="text-center py-10">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
//           <p className="mt-2 text-gray-500">Loading your applications...</p>
//         </div>
//       ) : applications.length === 0 ? (
//         <div className="bg-white rounded-lg shadow p-10 text-center">
//           <p className="text-gray-500">
//             You haven't submitted any applications yet.
//           </p>
//           <div className="mt-4 space-x-4">
//             <Link
//               to="/student/projects"
//               className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//             >
//               Browse Projects
//             </Link>
//             <Link
//               to="/student/internships"
//               className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//             >
//               Browse Internships
//             </Link>
//           </div>
//         </div>
//       ) : filteredApplications().length === 0 ? (
//         <div className="bg-white rounded-lg shadow p-10 text-center">
//           <p className="text-gray-500">
//             No applications found with the selected filter.
//           </p>
//           <button
//             onClick={() => setFilter("all")}
//             className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//           >
//             Show All Applications
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filteredApplications().map((application) => (
//             <div
//               key={application._id}
//               className="bg-white rounded-lg shadow overflow-hidden"
//             >
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h2 className="text-xl font-semibold">
//                       {application.opportunity
//                         ? application.opportunity.title
//                         : "Unknown Opportunity"}
//                     </h2>
//                     <div className="flex items-center text-gray-600 mt-1">
//                       {application.opportunityType === "Project" ? (
//                         <FaProjectDiagram className="mr-2" />
//                       ) : (
//                         <FaBriefcase className="mr-2" />
//                       )}
//                       <span>{application.opportunityType}</span>

//                       <span className="mx-2">•</span>

//                       <FaCalendarAlt className="mr-2" />
//                       <span>
//                         Applied on{" "}
//                         {new Date(
//                           application.submissionDate
//                         ).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>
//                   <div>{getStatusBadge(application.status)}</div>
//                 </div>

//                 <div className="mb-4">
//                   <h3 className="text-sm font-medium text-gray-700 mb-1">
//                     Cover Letter
//                   </h3>
//                   <div className="text-gray-600 border p-3 rounded bg-gray-50 max-h-24 overflow-y-auto">
//                     {application.coverLetter ? (
//                       <p className="whitespace-pre-line">
//                         {application.coverLetter}
//                       </p>
//                     ) : (
//                       <p className="text-gray-400 italic">
//                         No cover letter provided
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {application.feedback && (
//                   <div className="mb-4">
//                     <h3 className="text-sm font-medium text-gray-700 mb-1">
//                       Feedback
//                     </h3>
//                     <div className="text-gray-600 border p-3 rounded bg-gray-50">
//                       <p className="whitespace-pre-line">
//                         {application.feedback}
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex justify-between items-center mt-4">
//                   <div className="flex items-center">
//                     <FaFileAlt className="text-gray-500 mr-2" />
//                     <span className="text-sm text-gray-500">
//                       {application.resume
//                         ? "Resume attached"
//                         : "No resume attached"}
//                     </span>
//                   </div>

//                   <div className="flex space-x-2">
//                     {application.status === "Accepted" &&
//                       application.opportunityType === "Project" && (
//                         <Link
//                           to={`/student/projects/${application.opportunity._id}`}
//                           className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
//                         >
//                           View Project
//                         </Link>
//                       )}

//                     {application.status === "Accepted" &&
//                       application.opportunityType === "Internship" && (
//                         <Link
//                           to={`/student/internships/${application.opportunity._id}`}
//                           className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
//                         >
//                           View Internship
//                         </Link>
//                       )}

//                     {application.status === "Pending" && (
//                       <button
//                         onClick={() => {
//                           /* Future implementation - withdraw application */
//                         }}
//                         className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
//                       >
//                         Withdraw
//                       </button>
//                     )}

//                     <Link
//                       to={`/student/applications/${application._id}`}
//                       className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
//                     >
//                       View Details
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ApplicationList;



import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  FaProjectDiagram,
  FaBriefcase,
  FaCalendarAlt,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaEye,
  FaDownload,
} from "react-icons/fa";

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.get("/student/applications");

      setApplications(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center border border-yellow-200">
            <FaHourglassHalf className="mr-2 text-xs" /> Pending
          </span>
        );
      case "Accepted":
        return (
          <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center border border-green-200">
            <FaCheckCircle className="mr-2 text-xs" /> Accepted
          </span>
        );
      case "Rejected":
        return (
          <span className="bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center border border-red-200">
            <FaTimesCircle className="mr-2 text-xs" /> Rejected
          </span>
        );
      case "Withdrawn":
        return (
          <span className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center border border-gray-200">
            Withdrawn
          </span>
        );
      default:
        return (
          <span className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200">
            {status}
          </span>
        );
    }
  };

  const filteredApplications = () => {
    if (filter === "all") return applications;
    return applications.filter((app) => {
      if (filter === "projects") return app.opportunityType === "Project";
      if (filter === "internships") return app.opportunityType === "Internship";
      return app.status.toLowerCase() === filter.toLowerCase();
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f4f7fa' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Applications</h1>
              <p className="text-gray-600">Track and manage your project and internship applications</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold" style={{ color: '#123458' }}>{applications.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {[
              { key: "all", label: "All Applications", icon: null },
              { key: "projects", label: "Projects", icon: FaProjectDiagram },
              { key: "internships", label: "Internships", icon: FaBriefcase },
              { key: "pending", label: "Pending", icon: FaHourglassHalf },
              { key: "accepted", label: "Accepted", icon: FaCheckCircle },
              { key: "rejected", label: "Rejected", icon: FaTimesCircle },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-sm ${
                  filter === key
                    ? "text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:shadow-md hover:transform hover:scale-102"
                }`}
                style={{
                  backgroundColor: filter === key ? '#123458' : 'white',
                  borderColor: filter === key ? '#123458' : '#B8C8D9',
                  borderWidth: '1px'
                }}
              >
                {Icon && <Icon className="text-sm" />}
                <span>{label}</span>
                {key === "all" && (
                  <span className="ml-2 px-2 py-0.5 bg-opacity-20 bg-white rounded-full text-xs">
                    {applications.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div 
              className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mb-4"
              style={{ borderColor: '#B8C8D9', borderTopColor: 'transparent' }}
            ></div>
            <p className="text-gray-600 text-lg">Loading your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border" style={{ borderColor: '#B8C8D9' }}>
            <div className="mb-6">
              <div 
                className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
                style={{ backgroundColor: '#D4C9BE' }}
              >
                <FaFileAlt className="text-3xl text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600">Start your journey by applying to exciting projects and internships.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/student/projects"
                className="px-6 py-3 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                style={{ backgroundColor: '#123458' }}
              >
                Browse Projects
              </Link>
              <Link
                to="/student/internships"
                className="px-6 py-3 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                style={{ backgroundColor: '#123458' }}
              >
                Browse Internships
              </Link>
            </div>
          </div>
        ) : filteredApplications().length === 0 ? (
          /* No Filter Results */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border" style={{ borderColor: '#B8C8D9' }}>
            <div 
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6"
              style={{ backgroundColor: '#D4C9BE' }}
            >
              <FaFileAlt className="text-2xl text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600 mb-6">No applications match your current filter selection.</p>
            <button
              onClick={() => setFilter("all")}
              className="px-6 py-3 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
              style={{ backgroundColor: '#123458' }}
            >
              Show All Applications
            </button>
          </div>
        ) : (
          /* Applications Grid */
          <div className="space-y-6">
            {filteredApplications().map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border transition-all duration-300 hover:shadow-xl hover:transform hover:scale-102"
                style={{ borderColor: '#B8C8D9' }}
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div 
                          className="p-2 rounded-lg mr-3"
                          style={{ backgroundColor: '#D4C9BE' }}
                        >
                          {application.opportunityType === "Project" ? (
                            <FaProjectDiagram className="text-white" />
                          ) : (
                            <FaBriefcase className="text-white" />
                          )}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {application.opportunity
                              ? application.opportunity.title
                              : "Unknown Opportunity"}
                          </h2>
                          <span 
                            className="inline-block px-3 py-1 rounded-full text-sm font-medium mt-1"
                            style={{ backgroundColor: '#B8C8D9', color: '#123458' }}
                          >
                            {application.opportunityType}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <FaCalendarAlt className="mr-2" />
                        <span>
                          Applied on {new Date(application.submissionDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0">
                      {getStatusBadge(application.status)}
                    </div>
                  </div>

                  {/* Cover Letter Section */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Cover Letter
                    </h3>
                    <div 
                      className="border-2 border-dashed p-4 rounded-xl"
                      style={{ borderColor: '#B8C8D9', backgroundColor: '#f8fafc' }}
                    >
                      {application.coverLetter ? (
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {application.coverLetter.length > 200 
                            ? `${application.coverLetter.substring(0, 200)}...` 
                            : application.coverLetter}
                        </p>
                      ) : (
                        <p className="text-gray-400 italic">No cover letter provided</p>
                      )}
                    </div>
                  </div>

                  {/* Feedback Section */}
                  {application.feedback && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        Feedback
                      </h3>
                      <div 
                        className="border-2 border-dashed p-4 rounded-xl"
                        style={{ borderColor: '#D4C9BE', backgroundColor: '#fef7f0' }}
                      >
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {application.feedback}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 border-t" style={{ borderColor: '#B8C8D9' }}>
                    <div className="flex items-center mb-4 sm:mb-0">
                      <FaFileAlt className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {application.resume ? "Resume attached" : "No resume attached"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {application.status === "Accepted" && application.opportunityType === "Project" && (
                        <Link
                          to={`/student/projects/${application.opportunity._id}`}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors duration-300 font-medium"
                        >
                          <FaEye className="mr-2" />
                          View Project
                        </Link>
                      )}

                      {application.status === "Accepted" && application.opportunityType === "Internship" && (
                        <Link
                          to={`/student/internships/${application.opportunity._id}`}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors duration-300 font-medium"
                        >
                          <FaEye className="mr-2" />
                          View Internship
                        </Link>
                      )}

                      {application.status === "Pending" && (
                        <button
                          onClick={() => {
                            /* Future implementation - withdraw application */
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors duration-300 font-medium"
                        >
                          Withdraw
                        </button>
                      )}

                      <Link
                        to={`/student/applications/${application._id}`}
                        className="flex items-center px-4 py-2 text-white rounded-lg text-sm hover:shadow-lg transition-all duration-300 font-medium"
                        style={{ backgroundColor: '#123458' }}
                      >
                        <FaEye className="mr-2" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationList;
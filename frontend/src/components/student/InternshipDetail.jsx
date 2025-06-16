// import React, { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import api from "../../services/api"; // Your API service
// import {
//   FaBriefcase,
//   FaBuilding,
//   FaMapMarkerAlt,
//   FaCalendarAlt,
//   FaMoneyBillWave,
//   FaClock,
//   FaArrowLeft,
// } from "react-icons/fa";

// const InternshipDetail = () => {
//   const { id } = useParams(); // Get the internship ID from URL params
//   const [internship, setInternship] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchInternship = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(`/student/internships/${id}`);
//         setInternship(response.data.data); // Extract data from response
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to load internship details");
//         setLoading(false);
//         console.error("Error fetching internship:", err);
//       }
//     };

//     fetchInternship();
//   }, [id]);

//   // Format dates
//   const formatDate = (date) => {
//     return date ? new Date(date).toLocaleDateString() : "Not specified";
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-10">
//         <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
//         <p className="mt-2 text-gray-500">Loading internship details...</p>
//       </div>
//     );
//   }

//   if (error || !internship) {
//     return (
//       <div className="text-center py-10 text-red-500">
//         {error || "Internship not found"}
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Back Button */}
//       <Link
//         to="/student/internships"
//         className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
//       >
//         <FaArrowLeft className="mr-2" />
//         Back to Internships
//       </Link>

//       {/* Main Card */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="p-6">
//           {/* Header */}
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold text-gray-900">
//               {internship.title}
//             </h1>
//             <div className="flex items-center text-gray-600 mt-2">
//               <FaBuilding className="mr-2" />
//               <span>
//                 {internship.alumni?.company ||
//                   internship.company ||
//                   "Company not specified"}
//               </span>
//             </div>
//             <div className="mt-2">
//               <span
//                 className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
//                   internship.status === "Open"
//                     ? "bg-green-100 text-green-800"
//                     : internship.status === "Occupied"
//                     ? "bg-yellow-100 text-yellow-800"
//                     : "bg-gray-100 text-gray-800"
//                 }`}
//               >
//                 {internship.status}
//               </span>
//             </div>
//           </div>

//           {/* Basic Info Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <div className="flex items-center text-gray-600">
//               <FaMapMarkerAlt className="mr-2" />
//               <span>
//                 {internship.location || "Location not specified"}{" "}
//                 {internship.isRemote && "(Remote)"}
//               </span>
//             </div>
//             <div className="flex items-center text-gray-600">
//               <FaCalendarAlt className="mr-2" />
//               <span>Duration: {internship.duration || "Not specified"}</span>
//             </div>
//             <div className="flex items-center text-gray-600">
//               <FaMoneyBillWave className="mr-2" />
//               <span>Stipend: {internship.stipend || "Not specified"}</span>
//             </div>
//             <div className="flex items-center text-gray-600">
//               <FaBriefcase className="mr-2" />
//               <span>{internship.applicationCount || 0} applicants</span>
//             </div>
//             <div className="flex items-center text-gray-600">
//               <FaClock className="mr-2" />
//               <span>Start Date: {formatDate(internship.startDate)}</span>
//             </div>
//             <div className="flex items-center text-gray-600">
//               <FaClock className="mr-2" />
//               <span>Deadline: {formatDate(internship.deadline)}</span>
//             </div>
//           </div>

//           {/* Description */}
//           <div className="mb-6">
//             <h2 className="text-xl font-semibold mb-2">Description</h2>
//             <p className="text-gray-600 whitespace-pre-wrap">
//               {internship.description}
//             </p>
//           </div>

//           {/* Requirements */}
//           <div className="mb-6">
//             <h2 className="text-xl font-semibold mb-2">Requirements</h2>
//             <p className="text-gray-600 whitespace-pre-wrap">
//               {internship.requirements}
//             </p>
//           </div>

//           {/* Skills */}
//           {internship.skills && internship.skills.length > 0 && (
//             <div className="mb-6">
//               <h2 className="text-xl font-semibold mb-2">Required Skills</h2>
//               <div className="flex flex-wrap gap-2">
//                 {internship.skills.map((skill, index) => (
//                   <span
//                     key={index}
//                     className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
//                   >
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Alumni Info (optional) */}
//           {internship.alumni && (
//             <div className="mb-6">
//               <h2 className="text-xl font-semibold mb-2">Posted By</h2>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <p className="text-gray-600">
//                   <strong>Name:</strong> {internship.alumni.name}
//                 </p>
//                 <p className="text-gray-600">
//                   <strong>Job Title:</strong>{" "}
//                   {internship.alumni.currentJobTitle || "Not specified"}
//                 </p>
//                 <p className="text-gray-600">
//                   <strong>Company:</strong>{" "}
//                   {internship.alumni.company || "Not specified"}
//                 </p>
//                 <p className="text-gray-600">
//                   <strong>Graduation Year:</strong>{" "}
//                   {internship.alumni.passoutYear || "Not specified"}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           {internship.status === "Open" && !internship.hasApplied && (
//             <div className="flex justify-end">
//               <Link
//                 to={`/student/internships/apply/${internship._id}`}
//                 className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
//               >
//                 Apply Now
//               </Link>
//             </div>
//           )}
//           {internship.hasApplied && (
//             <div className="flex justify-end">
//               <span className="px-6 py-2 bg-gray-200 text-gray-700 rounded">
//                 Already Applied
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InternshipDetail;



import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api"; // Your API service
import {
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaClock,
  FaArrowLeft,
  FaUsers,
  FaGraduationCap,
  FaUser,
  FaCheckCircle,
} from "react-icons/fa";

const InternshipDetail = () => {
  const { id } = useParams(); // Get the internship ID from URL params
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/student/internships/${id}`);
        setInternship(response.data.data); // Extract data from response
        setLoading(false);
      } catch (err) {
        setError("Failed to load internship details");
        setLoading(false);
        console.error("Error fetching internship:", err);
      }
    };

    fetchInternship();
  }, [id]);

  // Format dates
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "Not specified";
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#f4f7fa' }}
      >
        <div className="text-center">
          <div 
            className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-opacity-20 border-t-opacity-100"
            style={{ borderColor: '#123458', borderTopColor: '#123458' }}
          ></div>
          <p className="mt-4 text-gray-600 text-lg font-medium">Loading internship details...</p>
        </div>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#f4f7fa' }}
      >
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <p className="text-red-600 text-lg font-medium">
              {error || "Internship not found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#f4f7fa' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          to="/student/internships"
          className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md mb-8"
          style={{ 
            backgroundColor: '#B8C8D9', 
            color: '#123458',
          }}
        >
          <FaArrowLeft className="mr-2" />
          Back to Internships
        </Link>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div 
                className="h-2"
                style={{ backgroundColor: '#123458' }}
              ></div>
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                      {internship.title}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-4">
                      <div 
                        className="p-2 rounded-lg mr-3"
                        style={{ backgroundColor: '#D4C9BE' }}
                      >
                        <FaBuilding className="text-gray-700" />
                      </div>
                      <span className="text-lg font-medium">
                        {internship.alumni?.company ||
                          internship.company ||
                          "Company not specified"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                        internship.status === "Open"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : internship.status === "Occupied"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                      }`}
                    >
                      {internship.status === "Open" && <FaCheckCircle className="mr-2" />}
                      {internship.status}
                    </span>
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className="flex items-center p-4 rounded-xl"
                    style={{ backgroundColor: '#f4f7fa' }}
                  >
                    <div 
                      className="p-3 rounded-lg mr-4"
                      style={{ backgroundColor: '#B8C8D9' }}
                    >
                      <FaMapMarkerAlt className="text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-gray-800 font-semibold">
                        {internship.location || "Not specified"}{" "}
                        {internship.isRemote && "(Remote)"}
                      </p>
                    </div>
                  </div>

                  <div 
                    className="flex items-center p-4 rounded-xl"
                    style={{ backgroundColor: '#f4f7fa' }}
                  >
                    <div 
                      className="p-3 rounded-lg mr-4"
                      style={{ backgroundColor: '#D4C9BE' }}
                    >
                      <FaCalendarAlt className="text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Duration</p>
                      <p className="text-gray-800 font-semibold">
                        {internship.duration || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div 
                    className="flex items-center p-4 rounded-xl"
                    style={{ backgroundColor: '#f4f7fa' }}
                  >
                    <div 
                      className="p-3 rounded-lg mr-4"
                      style={{ backgroundColor: '#B8C8D9' }}
                    >
                      <FaMoneyBillWave className="text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Stipend</p>
                      <p className="text-gray-800 font-semibold">
                        {internship.stipend || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div 
                    className="flex items-center p-4 rounded-xl"
                    style={{ backgroundColor: '#f4f7fa' }}
                  >
                    <div 
                      className="p-3 rounded-lg mr-4"
                      style={{ backgroundColor: '#D4C9BE' }}
                    >
                      <FaUsers className="text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Applicants</p>
                      <p className="text-gray-800 font-semibold">
                        {internship.applicationCount || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <div 
                  className="p-2 rounded-lg mr-3"
                  style={{ backgroundColor: '#D4C9BE' }}
                >
                  <FaBriefcase className="text-gray-700" />
                </div>
                Job Description
              </h2>
              <div 
                className="prose prose-gray max-w-none p-6 rounded-xl"
                style={{ backgroundColor: '#f4f7fa' }}
              >
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {internship.description}
                </p>
              </div>
            </div>

            {/* Requirements Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <div 
                  className="p-2 rounded-lg mr-3"
                  style={{ backgroundColor: '#B8C8D9' }}
                >
                  <FaCheckCircle className="text-gray-700" />
                </div>
                Requirements
              </h2>
              <div 
                className="prose prose-gray max-w-none p-6 rounded-xl"
                style={{ backgroundColor: '#f4f7fa' }}
              >
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {internship.requirements}
                </p>
              </div>
            </div>

            {/* Skills Card */}
            {internship.skills && internship.skills.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Required Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {internship.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 hover:shadow-md"
                      style={{ 
                        backgroundColor: '#B8C8D9',
                        color: '#123458',
                        borderColor: '#B8C8D9'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Timeline Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Important Dates</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div 
                    className="p-2 rounded-lg mr-4"
                    style={{ backgroundColor: '#D4C9BE' }}
                  >
                    <FaClock className="text-gray-700 text-sm" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Start Date</p>
                    <p className="text-gray-800 font-semibold">{formatDate(internship.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div 
                    className="p-2 rounded-lg mr-4"
                    style={{ backgroundColor: '#B8C8D9' }}
                  >
                    <FaCalendarAlt className="text-gray-700 text-sm" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Application Deadline</p>
                    <p className="text-gray-800 font-semibold">{formatDate(internship.deadline)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alumni Info Card */}
            {internship.alumni && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div 
                    className="p-2 rounded-lg mr-3"
                    style={{ backgroundColor: '#D4C9BE' }}
                  >
                    <FaUser className="text-gray-700 text-sm" />
                  </div>
                  Posted By
                </h3>
                <div 
                  className="p-6 rounded-xl space-y-3"
                  style={{ backgroundColor: '#f4f7fa' }}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-gray-800 font-semibold">{internship.alumni.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Position</p>
                    <p className="text-gray-800 font-semibold">
                      {internship.alumni.currentJobTitle || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Company</p>
                    <p className="text-gray-800 font-semibold">
                      {internship.alumni.company || "Not specified"}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <FaGraduationCap className="mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Class of {internship.alumni.passoutYear || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              {internship.status === "Open" && !internship.hasApplied ? (
                <Link
                  to={`/student/internships/apply/${internship._id}`}
                  className="w-full inline-flex items-center justify-center px-6 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
                  style={{ backgroundColor: '#123458' }}
                >
                  <FaBriefcase className="mr-2" />
                  Apply Now
                </Link>
              ) : internship.hasApplied ? (
                <div 
                  className="w-full inline-flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-lg border-2"
                  style={{ 
                    backgroundColor: '#D4C9BE',
                    color: '#123458',
                    borderColor: '#D4C9BE'
                  }}
                >
                  <FaCheckCircle className="mr-2" />
                  Already Applied
                </div>
              ) : (
                <div 
                  className="w-full inline-flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-lg border-2"
                  style={{ 
                    backgroundColor: '#f4f7fa',
                    color: '#6b7280',
                    borderColor: '#e5e7eb'
                  }}
                >
                  Position Closed
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetail;
// import React, { useState, useEffect } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import api from "../../services/api";
// import { FaArrowLeft, FaFileUpload } from "react-icons/fa";

// const InternshipApply = () => {
//   const { id } = useParams(); // Get internship ID from URL
//   const navigate = useNavigate();
//   const [internship, setInternship] = useState(null);
//   const [formData, setFormData] = useState({
//     coverLetter: "",
//     resume: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   // Fetch internship details on mount
//   useEffect(() => {
//     const fetchInternship = async () => {
//       try {
//         const response = await api.get(`/student/internships/${id}`);
//         setInternship(response.data.data);
//         setLoading(false);
//       } catch (err) {
//         setError("Failed to load internship details");
//         setLoading(false);
//         console.error("Error fetching internship:", err);
//       }
//     };
//     fetchInternship();
//   }, [id]);

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const response = await api.post(`/student/apply/internship/${id}`, {
//         coverLetter: formData.coverLetter,
//         resume: formData.resume,
//       });

//       setSuccess(response.data.message);
//       setFormData({ coverLetter: "", resume: "" });

//       // Redirect to internship details after a short delay
//       setTimeout(() => {
//         navigate(`/student/internships/${id}`);
//       }, 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to submit application");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-10">
//         <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
//         <p className="mt-2 text-gray-500">Loading...</p>
//       </div>
//     );
//   }

//   if (error && !internship) {
//     return (
//       <div className="text-center py-10 text-red-500">
//         {error}
//         <Link
//           to="/student/internships"
//           className="block mt-4 text-indigo-600 hover:text-indigo-800"
//         >
//           Back to Internships
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       {/* Back Button */}
//       <Link
//         to={`/student/internships/${id}`}
//         className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
//       >
//         <FaArrowLeft className="mr-2" />
//         Back to Internship Details
//       </Link>

//       {/* Internship Context */}
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <h1 className="text-2xl font-bold mb-2">{internship.title}</h1>
//         <p className="text-gray-600">
//           {internship.alumni?.company || internship.company || "Company"} |{" "}
//           {internship.location || "Location not specified"}{" "}
//           {internship.isRemote && "(Remote)"}
//         </p>
//       </div>

//       {/* Application Form */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">Apply for Internship</h2>

//         {success && (
//           <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
//             {success}
//           </div>
//         )}
//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label
//               htmlFor="coverLetter"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Cover Letter
//             </label>
//             <textarea
//               id="coverLetter"
//               name="coverLetter"
//               value={formData.coverLetter}
//               onChange={handleChange}
//               rows="6"
//               className="w-full p-2 border rounded focus:ring focus:ring-indigo-200"
//               placeholder="Write your cover letter here..."
//               required
//             />
//           </div>

//           <div className="mb-6">
//             <label
//               htmlFor="resume"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Resume URL
//             </label>
//             <input
//               type="url"
//               id="resume"
//               name="resume"
//               value={formData.resume}
//               onChange={handleChange}
//               className="w-full p-2 border rounded focus:ring focus:ring-indigo-200"
//               placeholder="Paste the URL to your resume (e.g., Google Drive link)"
//               required
//             />
//             <p className="text-sm text-gray-500 mt-1">
//               Please provide a publicly accessible link to your resume
//             </p>
//           </div>

//           <div className="flex justify-end space-x-2">
//             <Link
//               to={`/student/internships/${id}`}
//               className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
//             >
//               Cancel
//             </Link>
//             <button
//               type="submit"
//               disabled={submitting}
//               className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 ${
//                 submitting ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               {submitting ? "Submitting..." : "Submit Application"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default InternshipApply;



import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { FaArrowLeft, FaFileUpload, FaBriefcase, FaBuilding, FaMapMarkerAlt, FaPaperPlane, FaEdit, FaLink } from "react-icons/fa";

const InternshipApply = () => {
  const { id } = useParams(); // Get internship ID from URL
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [formData, setFormData] = useState({
    coverLetter: "",
    resume: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch internship details on mount
  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const response = await api.get(`/student/internships/${id}`);
        setInternship(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load internship details");
        setLoading(false);
        console.error("Error fetching internship:", err);
      }
    };
    fetchInternship();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post(`/student/apply/internship/${id}`, {
        coverLetter: formData.coverLetter,
        resume: formData.resume,
      });

      setSuccess(response.data.message);
      setFormData({ coverLetter: "", resume: "" });

      // Redirect to internship details after a short delay
      setTimeout(() => {
        navigate(`/student/internships/${id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
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
          <p className="mt-4 text-gray-600 text-lg font-medium">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (error && !internship) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#f4f7fa' }}
      >
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md">
            <p className="text-red-600 text-lg font-medium mb-4">{error}</p>
            <Link
              to="/student/internships"
              className="inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
              style={{ 
                backgroundColor: '#B8C8D9', 
                color: '#123458',
              }}
            >
              <FaArrowLeft className="mr-2" />
              Back to Internships
            </Link>
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
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to={`/student/internships/${id}`}
          className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md mb-8"
          style={{ 
            backgroundColor: '#B8C8D9', 
            color: '#123458',
          }}
        >
          <FaArrowLeft className="mr-2" />
          Back to Internship Details
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div 
                className="h-2"
                style={{ backgroundColor: '#123458' }}
              ></div>
              <div className="p-8">
                <div className="flex items-center mb-8">
                  <div 
                    className="p-3 rounded-xl mr-4"
                    style={{ backgroundColor: '#D4C9BE' }}
                  >
                    <FaPaperPlane className="text-gray-700 text-xl" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Apply for Internship</h1>
                    <p className="text-gray-600 mt-1">Submit your application to get started</p>
                  </div>
                </div>

                {/* Success/Error Messages */}
                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <FaPaperPlane className="text-green-600" />
                      </div>
                      <p className="text-green-800 font-medium">{success}</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center">
                      <div className="bg-red-100 p-2 rounded-lg mr-3">
                        <FaFileUpload className="text-red-600" />
                      </div>
                      <p className="text-red-800 font-medium">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Cover Letter Section */}
                  <div>
                    <label
                      htmlFor="coverLetter"
                      className="flex items-center text-lg font-semibold text-gray-900 mb-3"
                    >
                      <div 
                        className="p-2 rounded-lg mr-3"
                        style={{ backgroundColor: '#B8C8D9' }}
                      >
                        <FaEdit className="text-gray-700" />
                      </div>
                      Cover Letter
                    </label>
                    <div 
                      className="p-1 rounded-xl"
                      style={{ backgroundColor: '#f4f7fa' }}
                    >
                      <textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleChange}
                        rows="8"
                        className="w-full p-4 border-0 rounded-lg resize-none focus:ring-2 focus:outline-none"
                        style={{ 
                          focusRingColor: '#123458',
                          backgroundColor: 'white'
                        }}
                        placeholder="Tell us why you're interested in this internship and what makes you a great candidate..."
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Share your motivation, relevant experience, and what you hope to achieve
                    </p>
                  </div>

                  {/* Resume URL Section */}
                  <div>
                    <label
                      htmlFor="resume"
                      className="flex items-center text-lg font-semibold text-gray-900 mb-3"
                    >
                      <div 
                        className="p-2 rounded-lg mr-3"
                        style={{ backgroundColor: '#D4C9BE' }}
                      >
                        <FaLink className="text-gray-700" />
                      </div>
                      Resume Link
                    </label>
                    <div 
                      className="p-1 rounded-xl"
                      style={{ backgroundColor: '#f4f7fa' }}
                    >
                      <input
                        type="url"
                        id="resume"
                        name="resume"
                        value={formData.resume}
                        onChange={handleChange}
                        className="w-full p-4 border-0 rounded-lg focus:ring-2 focus:outline-none"
                        style={{ 
                          focusRingColor: '#123458',
                          backgroundColor: 'white'
                        }}
                        placeholder="https://drive.google.com/file/d/your-resume-link"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Provide a publicly accessible link to your resume (Google Drive, Dropbox, etc.)
                    </p>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Link
                      to={`/student/internships/${id}`}
                      className="flex-1 inline-flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-gray-700 transition-all duration-200 hover:shadow-md border-2"
                      style={{ 
                        backgroundColor: '#f4f7fa',
                        borderColor: '#B8C8D9'
                      }}
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`flex-1 inline-flex items-center justify-center px-6 py-4 rounded-xl text-white font-semibold transition-all duration-200 ${
                        submitting 
                          ? "opacity-50 cursor-not-allowed" 
                          : "hover:shadow-lg transform hover:-translate-y-1"
                      }`}
                      style={{ backgroundColor: '#123458' }}
                    >
                      {submitting ? (
                        <>
                          <div 
                            className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"
                          ></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="mr-2" />
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Internship Context Sidebar */}
          <div className="space-y-6">
            {/* Position Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <div 
                  className="p-2 rounded-lg mr-3"
                  style={{ backgroundColor: '#D4C9BE' }}
                >
                  <FaBriefcase className="text-gray-700" />
                </div>
                Position Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {internship.title}
                  </h4>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaBuilding className="mr-2 text-sm" />
                    <span className="font-medium">
                      {internship.alumni?.company || internship.company || "Company"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-sm" />
                    <span>
                      {internship.location || "Location not specified"}{" "}
                      {internship.isRemote && "(Remote)"}
                    </span>
                  </div>
                </div>

                <div 
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: '#f4f7fa' }}
                >
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium">Duration</p>
                      <p className="text-gray-800">{internship.duration || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Stipend</p>
                      <p className="text-gray-800">{internship.stipend || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Tips Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Application Tips</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div 
                  className="p-4 rounded-lg border-l-4"
                  style={{ 
                    backgroundColor: '#f4f7fa',
                    borderLeftColor: '#123458'
                  }}
                >
                  <p className="font-medium text-gray-800 mb-1">Cover Letter</p>
                  <p>Be specific about your interest and relevant experience</p>
                </div>
                <div 
                  className="p-4 rounded-lg border-l-4"
                  style={{ 
                    backgroundColor: '#f4f7fa',
                    borderLeftColor: '#B8C8D9'
                  }}
                >
                  <p className="font-medium text-gray-800 mb-1">Resume Link</p>
                  <p>Ensure your resume is easily accessible and up-to-date</p>
                </div>
                <div 
                  className="p-4 rounded-lg border-l-4"
                  style={{ 
                    backgroundColor: '#f4f7fa',
                    borderLeftColor: '#D4C9BE'
                  }}
                >
                  <p className="font-medium text-gray-800 mb-1">Follow Up</p>
                  <p>Check your email regularly for updates on your application</p>
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Applications</span>
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-semibold"
                    style={{ 
                      backgroundColor: '#B8C8D9',
                      color: '#123458'
                    }}
                  >
                    {internship.applicationCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Position Status</span>
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      internship.status === "Open"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {internship.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipApply;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaBuilding,
  FaGraduationCap,
  FaBriefcase,
  FaCode,
  FaUserPlus,
  FaCheck,
  FaTimes,
  FaComment,
  FaHourglassHalf,
  FaEye,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTimes as FaClose,
} from "react-icons/fa";
import api from "../../services/api";

const SearchAlumni = () => {
  const [searchParams, setSearchParams] = useState({
    name: "",
    // skills: "",
    industry: "",
    company: "",
    passoutYear: "",
    degree: "",
  });
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });
  const [requestLoading, setRequestLoading] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // New state for profile popup
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Fetch alumni on initial load and whenever search params or page changes
  useEffect(() => {
    searchAlumni();
  }, [pagination.currentPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const searchAlumni = async (e) => {
    if (e) e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Build query string from searchParams
      const queryParams = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      queryParams.append("page", pagination.currentPage);
      queryParams.append("limit", 10);

      const response = await api.get(`/student/search?${queryParams}`);
      setAlumni(response.data.alumni);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total,
      });
    } catch (error) {
      console.error("Error searching alumni:", error);
      setError("Failed to search alumni. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, currentPage: newPage });
    }
  };

  const handleConnectionRequest = async (alumniId) => {
    setRequestLoading({ ...requestLoading, [alumniId]: true });
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await api.post(
        `/student/connection-request/${alumniId}`,
        {
          message: `Hi! I'm interested in connecting with you.`,
        }
      );

      setSuccessMessage("Connection request sent successfully!");

      // Update the alumni connection status in the state
      setAlumni(
        alumni.map((alum) =>
          alum._id === alumniId
            ? { ...alum, connectionStatus: "pending", requestSentByMe: true }
            : alum
        )
      );
    } catch (error) {
      console.error("Error sending connection request:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to send connection request. Please try again."
      );
    } finally {
      setRequestLoading({ ...requestLoading, [alumniId]: false });
    }
  };

  // New function to view alumni profile
  const handleViewProfile = async (alumniId) => {
    setProfileLoading(true);
    try {
      const response = await api.get(`/student/alumni/profile/${alumniId}`);
      setSelectedAlumni(response.data);
      setShowProfileModal(true);
    } catch (error) {
      console.error("Error fetching alumni profile:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to load alumni profile. Please try again."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setSelectedAlumni(null);
  };

  // This functions needs to be implemented (copied from your existing code)
  const handleAcceptRequest = (alumniId) => {
    // Implementation for accepting connection request
    console.log("Accept request for:", alumniId);
  };

  // This functions needs to be implemented (copied from your existing code)
  const handleRejectRequest = (alumniId) => {
    // Implementation for rejecting connection request
    console.log("Reject request for:", alumniId);
  };

  const renderConnectionButton = (alum) => {
    if (alum.connectionStatus === "accepted" && alum.chatId) {
      return (
        <Link
          to={`/student/chats?activeChat=${alum.chatId}`}
          className="flex items-center px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700"
        >
          <FaComment className="mr-1" /> Message
        </Link>
      );
    } else if (alum.connectionStatus === "pending") {
      if (alum.requestSentByMe) {
        return (
          <button
            disabled
            className="flex items-center px-3 py-1 bg-yellow-500 text-white rounded text-sm opacity-80 cursor-not-allowed"
          >
            <FaHourglassHalf className="mr-1" /> Request Pending
          </button>
        );
      } else {
        // The alumni sent the request to the student
        return (
          <>
            <button
              onClick={() => handleAcceptRequest(alum._id)}
              className="px-2 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 mr-1"
            >
              <FaCheck /> Accept
            </button>
            <button
              onClick={() => handleRejectRequest(alum._id)}
              className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              <FaTimes /> Reject
            </button>
          </>
        );
      }
    } else if (alum.connectionStatus === "rejected") {
      return (
        <button
          disabled
          className="flex items-center px-3 py-1 bg-gray-400 text-white rounded text-sm opacity-80 cursor-not-allowed"
        >
          Request Rejected
        </button>
      );
    } else {
      return (
        <button
          onClick={() => handleConnectionRequest(alum._id)}
          disabled={requestLoading[alum._id]}
          className="flex items-center px-3 py-1 text-white rounded text-sm hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: '#13345C' }}
        >
          {requestLoading[alum._id] ? (
            "Sending..."
          ) : (
            <>
              <FaUserPlus className="mr-1" /> Connect
            </>
          )}
        </button>
      );
    }
  };

  // Profile Modal Component
  const ProfileModal = () => {
    if (!selectedAlumni || !showProfileModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-auto">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold">Alumni Profile</h2>
            <button
              onClick={closeProfileModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaClose className="text-xl" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {profileLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Personal Info */}
                <div className="col-span-1">
                  <div className="flex flex-col items-center mb-6">
                    <div className="bg-indigo-100 rounded-full p-8 mb-4">
                      <FaUser className="text-indigo-600 text-5xl" />
                    </div>
                    <h3 className="text-xl font-bold text-center">
                      {selectedAlumni.name}
                    </h3>
                    {selectedAlumni.currentJobTitle && (
                      <p className="text-gray-600 text-center">
                        {selectedAlumni.currentJobTitle}{" "}
                        {selectedAlumni.company &&
                          `at ${selectedAlumni.company}`}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    {selectedAlumni.email && (
                      <div className="flex items-center">
                        <FaEnvelope className="text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p>{selectedAlumni.email}</p>
                        </div>
                      </div>
                    )}

                    {selectedAlumni.contactInfo && (
                      <div className="flex items-center">
                        <FaPhone className="text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Contact</p>
                          <p>{selectedAlumni.contactInfo}</p>
                        </div>
                      </div>
                    )}

                    {selectedAlumni.passoutYear && (
                      <div className="flex items-center">
                        <FaGraduationCap className="text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Graduation</p>
                          <p>
                            {selectedAlumni.degree || "Degree"} (
                            {selectedAlumni.passoutYear})
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedAlumni.industry && (
                      <div className="flex items-center">
                        <FaBuilding className="text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Industry</p>
                          <p>{selectedAlumni.industry}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    {renderConnectionButton(selectedAlumni)}
                  </div>
                </div>

                {/* Right Column - Bio, Skills, Expertise */}
                <div className="col-span-2">
                  {selectedAlumni.bio && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-2">About</h4>
                      <p className="text-gray-700">{selectedAlumni.bio}</p>
                    </div>
                  )}

                  {selectedAlumni.skills &&
                    selectedAlumni.skills.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2">Skills</h4>
                        <div className="flex flex-wrap">
                          {selectedAlumni.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="text-white rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2"
                              style={{ backgroundColor: '#13345C' }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {selectedAlumni.expertise &&
                    selectedAlumni.expertise.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2">
                          Areas of Expertise
                        </h4>
                        <div className="flex flex-wrap">
                          {selectedAlumni.expertise.map((item, index) => (
                            <span
                              key={index}
                              className="bg-emerald-100 text-emerald-800 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t flex justify-end">
            <button
              onClick={closeProfileModal}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Search Alumni</h1>

      {/* Success and error messages */}
      {successMessage && (
        <div className="bg-emerald-100 border border-emerald-400 text-emerald-700 px-4 py-3 rounded mb-4">
          <p>{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Search Filters</h2>
          <form onSubmit={searchAlumni}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FaUser className="text-gray-400" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={searchParams.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Search by name"
                  />
                </div>
              </div>

              {/* <div>
                <label className="block text-gray-700 mb-1">Skills</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FaCode className="text-gray-400" />
                  </span>
                  <input
                    type="text"
                    name="skills"
                    value={searchParams.skills}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="E.g., Python, Java, React"
                  />
                </div>
              </div> */}

              {/* <div>
                <label className="block text-gray-700 mb-1">Industry</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FaBuilding className="text-gray-400" />
                  </span>
                  <input
                    type="text"
                    name="industry"
                    value={searchParams.industry}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="E.g., Tech, Finance"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Company</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FaBriefcase className="text-gray-400" />
                  </span>
                  <input
                    type="text"
                    name="company"
                    value={searchParams.company}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Graduation Year
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FaGraduationCap className="text-gray-400" />
                  </span>
                  <input
                    type="text"
                    name="passoutYear"
                    value={searchParams.passoutYear}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Year of graduation"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Degree</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FaGraduationCap className="text-gray-400" />
                  </span>
                  <input
                    type="text"
                    name="degree"
                    value={searchParams.degree}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="E.g., B.Tech, M.Sc."
                  />
                </div>
              </div> */}
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="text-white px-4 py-2 rounded hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
                style={{ backgroundColor: '#13345C' }}
                disabled={loading}
              >
                <FaSearch className="mr-2" />
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Results</h2>
            <p className="text-gray-500">{pagination.total} alumni found</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          ) : alumni.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
                No alumni found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {alumni.map((alum) => (
                <div
                  key={alum._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="bg-gray-200 rounded-full p-3 mr-4">
                        <FaUser className="text-gray-500 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{alum.name}</h3>
                        <div className="text-gray-600">
                          {alum.currentJobTitle && (
                            <p className="flex items-center">
                              <FaBriefcase className="mr-1" />
                              {alum.currentJobTitle}{" "}
                              {alum.company && `at ${alum.company}`}
                            </p>
                          )}
                          {alum.degree && (
                            <p className="flex items-center">
                              <FaGraduationCap className="mr-1" />
                              {alum.degree}{" "}
                              {alum.passoutYear && `(${alum.passoutYear})`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {/* View Profile Button */}
                      <button
                        onClick={() => handleViewProfile(alum._id)}
                        className="flex items-center px-3 py-1 text-white rounded text-sm hover:opacity-90"
                        style={{ backgroundColor: '#13345C' }}
                      >
                        <FaEye className="mr-1" /> View Profile
                      </button>
                      {renderConnectionButton(alum)}
                    </div>
                  </div>

                  <div className="mt-3">
                    {alum.industry && (
                      <span 
                        className="inline-block text-white rounded-full px-3 py-1 text-xs font-semibold mr-2 mb-2"
                        style={{ backgroundColor: '#13345C' }}
                      >
                        {alum.industry}
                      </span>
                    )}
                    {alum.skills &&
                      alum.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-xs font-semibold mr-2 mb-2"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>

                  {alum.bio && (
                    <div className="mt-2 text-gray-600 text-sm">
                      <p className="line-clamp-2">{alum.bio}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex space-x-1">
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={pagination.currentPage === 1}
                      className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>

                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 border rounded ${
                          pagination.currentPage === page
                            ? "text-white"
                            : "hover:bg-gray-50"
                        }`}
                        style={pagination.currentPage === page ? { backgroundColor: '#13345C' } : {}}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal />
    </div>
  );
};

export default SearchAlumni;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api"; // Adjust the path based on your project structure

const InternshipDetailPage = () => {
  const { id } = useParams(); // Get internship ID from URL
  const navigate = useNavigate();

  // State variables
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    location: "",
    isRemote: false,
    duration: "",
    stipend: "",
    status: "",
    deadline: "",
    startDate: "",
    skills: [],
  });

  // Fetch internship data on mount
  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const response = await api.get(`/alumni/internships/${id}`);
        const data = response.data;
        setInternship(data);
        setFormData({
          title: data.title || "",
          company: data.company || "",
          description: data.description || "",
          requirements: data.requirements || "",
          location: data.location || "",
          isRemote: data.isRemote || false,
          duration: data.duration || "",
          stipend: data.stipend || "",
          status: data.status || "Open",
          deadline: data.deadline
            ? new Date(data.deadline).toISOString().split("T")[0]
            : "",
          startDate: data.startDate
            ? new Date(data.startDate).toISOString().split("T")[0]
            : "",
          skills: data.skills || [],
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch internship");
        setLoading(false);
      }
    };
    fetchInternship();
  }, [id]);

  // Handle input changes for text, textarea, select, and checkbox fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle skills input as a comma-separated string
  const handleArrayInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }));
  };

  // Handle internship update
  const handleUpdate = async () => {
    try {
      const response = await api.put(`/alumni/internships/${id}`, formData);
      setInternship(response.data);
      setIsEditing(false);
      alert("Internship updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update internship");
    }
  };

  // Handle internship deletion
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this internship?")) {
      try {
        await api.delete(`/alumni/internships/${id}`);
        alert("Internship deleted successfully");
        navigate("/alumni/dashboard");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete internship");
      }
    }
  };

  // Determine status color
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
        <p className="text-[#123458] text-lg">Loading internship details...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-[#f4f7fa] flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-red-200">
        <div className="text-red-600 text-6xl mb-4">⚠️</div>
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    </div>
  );
  
  if (!internship) return (
    <div className="min-h-screen bg-[#f4f7fa] flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-[#B8C8D9] text-6xl mb-4">📋</div>
        <p className="text-[#123458] text-lg font-semibold">Internship not found</p>
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

        {/* Internship details or edit form */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#B8C8D9]/20 overflow-hidden">
          {isEditing ? (
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-[#f4f7fa] rounded-lg">
                  <svg className="w-6 h-6 text-[#123458]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-[#123458]">Edit Internship</h2>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#B8C8D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
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
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#B8C8D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#123458] mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#B8C8D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#123458] mb-2">
                      Stipend
                    </label>
                    <input
                      type="text"
                      name="stipend"
                      value={formData.stipend}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#B8C8D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent transition-all duration-200"
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
                      Deadline
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
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#B8C8D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#123458] mb-2">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills.join(", ")}
                    onChange={handleArrayInputChange}
                    placeholder="e.g., React, Node.js, Python"
                    className="w-full px-4 py-3 border border-[#B8C8D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isRemote"
                    checked={formData.isRemote}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#123458] border-[#B8C8D9] rounded focus:ring-[#123458]"
                  />
                  <label className="text-sm font-semibold text-[#123458]">
                    Remote Work Available
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-[#B8C8D9]/20">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-[#B8C8D9] text-[#123458] font-semibold rounded-xl hover:bg-[#B8C8D9]/80 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="px-6 py-3 bg-[#123458] text-white font-semibold rounded-xl hover:bg-[#123458]/90 transition-colors duration-200"
                  >
                    Save Changes
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
                    <h1 className="text-4xl font-bold mb-2">{internship.title}</h1>
                    <p className="text-xl text-white/90 mb-4">{internship.company}</p>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getStatusClass(internship.status)} font-semibold text-sm`}>
                      <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                      {internship.status}
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
                        <p className="text-[#123458] leading-relaxed">{internship.description}</p>
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
                        <p className="text-[#123458] leading-relaxed">{internship.requirements}</p>
                      </div>
                    </div>

                    {internship.skills.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-[#123458] mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Required Skills
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {internship.skills.map((skill, index) => (
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
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    <div className="bg-[#f4f7fa] p-6 rounded-xl border border-[#B8C8D9]/20">
                      <h3 className="text-lg font-bold text-[#123458] mb-4">Internship Details</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-[#123458] mb-1">Location</p>
                          <p className="text-[#123458] flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {internship.location} {internship.isRemote && (
                              <span className="ml-2 px-2 py-1 bg-[#123458] text-white text-xs rounded-full">Remote</span>
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-[#123458] mb-1">Duration</p>
                          <p className="text-[#123458] flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {internship.duration}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-[#123458] mb-1">Stipend</p>
                          <p className="text-[#123458] flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            {internship.stipend || "Not specified"}
                          </p>
                        </div>

                        {internship.deadline && (
                          <div>
                            <p className="text-sm font-semibold text-[#123458] mb-1">Deadline</p>
                            <p className="text-[#123458] flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(internship.deadline).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {internship.startDate && (
                          <div>
                            <p className="text-sm font-semibold text-[#123458] mb-1">Start Date</p>
                            <p className="text-[#123458] flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(internship.startDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
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

export default InternshipDetailPage;
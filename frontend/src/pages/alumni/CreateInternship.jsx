import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // Import centralized Axios instance
import { useAuth } from "../../context/AuthContext";

const CreateInternship = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [internship, setInternship] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    location: "",
    isRemote: false,
    duration: "",
    stipend: "",
    deadline: "",
    startDate: "",
    skills: [],
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInternship({
      ...internship,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle skills input (comma separated)
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(",").map((skill) => skill.trim());
    setInternship({ ...internship, skills: skillsArray });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/alumni/internships", internship);

      if (response.status === 201) {
        // Internship created successfully
        navigate("/alumni");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create internship. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zM8 5a1 1 0 011-1h2a1 1 0 011 1v1H8V5zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 001-1v-3a1 1 0 000-2H9z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#123458' }}>
            Create New Internship
          </h1>
          <p className="text-gray-600">Share your internship opportunity with talented students</p>
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
            {/* Internship Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                Internship Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={internship.title}
                onChange={handleChange}
                className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
                placeholder="Enter the internship title"
                required
              />
            </div>

            {/* Company */}
            <div className="space-y-2">
              <label htmlFor="company" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={internship.company}
                onChange={handleChange}
                className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
                placeholder="Enter the company name"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={internship.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50 resize-none"
                placeholder="Describe the internship in detail"
                required
              ></textarea>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <label htmlFor="requirements" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                Requirements
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={internship.requirements}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50 resize-none"
                placeholder="List the specific requirements for this internship"
                required
              ></textarea>
            </div>

            {/* Location and Remote */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={internship.location}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
                  placeholder="Enter location or 'Remote'"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold" style={{ color: '#123458' }}>
                  Work Mode
                </label>
                <div className="flex items-center h-14 px-4 py-4 rounded-2xl border-2 border-gray-200 bg-white/50">
                  <input
                    type="checkbox"
                    id="isRemote"
                    name="isRemote"
                    checked={internship.isRemote}
                    onChange={handleChange}
                    className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isRemote" className="text-gray-700 font-medium">
                    This is a remote internship
                  </label>
                </div>
              </div>
            </div>

            {/* Duration and Stipend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="duration" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  placeholder="e.g., 3 months, Summer 2025"
                  value={internship.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="stipend" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                  Stipend
                </label>
                <input
                  type="text"
                  id="stipend"
                  name="stipend"
                  placeholder="e.g., $1000/month, Unpaid"
                  value={internship.stipend}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
                  required
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
                placeholder="e.g., Marketing, Graphic Design, Social Media"
                value={internship.skills.join(", ")}
                onChange={handleSkillsChange}
                className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate skills with commas
              </p>
            </div>

            {/* Deadline and Start Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="deadline" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                  Application Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={internship.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 bg-white/50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="startDate" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={internship.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 bg-white/50"
                />
              </div>
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
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center justify-center ${
                  loading ? "opacity-50 cursor-not-allowed transform-none" : ""
                }`}
                style={{ 
                  backgroundColor: '#123458',
                  boxShadow: loading ? 'none' : '0 10px 30px -5px rgba(18, 52, 88, 0.3)'
                }}
              >
                {loading ? (
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
                    Create Internship
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

export default CreateInternship;
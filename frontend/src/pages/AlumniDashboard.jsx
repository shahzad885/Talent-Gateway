// src/pages/AlumniDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

// Import Components
import Sidebar from "../components/Sidebar";
import ProjectCard from "../components/ProjectCard";
import InternshipCard from "../components/InternshipCard";
import ApplicationRow from "../components/ApplicationRow";
import NotificationList from "../components/NotificationList";
import DashboardStats from "../components/DashboardStats";
import AlumniChatList from "../components/alumni/AlumniChatList";
import VideoCall from "../components/alumni/VideoCall";

const AlumniDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [connectionRequests, setConnectionRequests] = useState([]);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    company: user?.company || "",
    linkedin: user?.linkedin || "",
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch dashboard overview
        const dashboardRes = await api.get("/alumni/dashboard");
        console.log(dashboardRes.data);
        // Fetch projects
        const projectsRes = await api.get("/alumni/projects");

        // Fetch internships
        const internshipsRes = await api.get("/alumni/internships");

        // Fetch pending applications
        const applicationsRes = await api.get("/alumni/applications");

        // Fetch pending submissions
        const submissionsRes = await api.get("/alumni/submissions");

        // Fetch notifications
        const notificationsRes = await api.get("/alumni/notifications");

        //Fetch connection requests
        const connectionReqRes = await api.get("/alumni/connection-requests");

        setDashboardData(dashboardRes.data);
        setProjects(projectsRes.data);
        setInternships(internshipsRes.data);
        setApplications(
          applicationsRes.data.filter((app) => app.status === "Pending")
        );
        setPendingSubmissions(
          submissionsRes.data.filter((sub) => sub.status === "Submitted")
        );
        setNotifications(notificationsRes.data);
        setConnectionRequests(connectionReqRes.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleProjectCreation = () => {
    navigate("/alumni/projects/new");
  };

  const handleInternshipCreation = () => {
    navigate("/alumni/internships/new");
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfileChanges = async () => {
    try {
      await api.put("/alumni/profile", formData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleConnectionAction = async (requestId, status) => {
    try {
      await api.put(`/alumni/connection-requests/${requestId}`, { status });

      setConnectionRequests(
        connectionRequests.filter((req) => req._id !== requestId)
      );

      alert(`Connection request ${status}`);

      if (status === "accepted") {
        const dashboardRes = await api.get("/alumni/dashboard");
        setDashboardData(dashboardRes.data);
      }
    } catch (error) {
      console.error("Error updating connection request:", error);
      alert("Failed to update connection request");
    }
  };

  const handleApplicationAction = async (
    applicationId,
    status,
    feedback = ""
  ) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(`/alumni/applications/${applicationId}`, {
        status,
        feedback,
      });

      setApplications(applications.filter((app) => app._id !== applicationId));

      const dashboardRes = await api.get("/alumni/dashboard");
      setDashboardData(dashboardRes.data);
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  const handleSubmissionAction = async (
    submissionId,
    status,
    feedback = ""
  ) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(`/alumni/submissions/${submissionId}`, {
        status,
        feedback,
      });

      setPendingSubmissions(
        pendingSubmissions.filter((sub) => sub._id !== submissionId)
      );

      const dashboardRes = await api.get("/alumni/dashboard");
      setDashboardData(dashboardRes.data);
    } catch (error) {
      console.error("Error updating submission:", error);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.put("/alumni/notifications", {});

      setNotifications(
        notifications.map((notif) => ({ ...notif, read: true }))
      );

      const dashboardRes = await api.get("/alumni/dashboard");
      setDashboardData(dashboardRes.data);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f4f7fa 0%, #B8C8D9 100%)' }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#D4C9BE] border-t-[#123458] rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-[#B8C8D9] rounded-full animate-pulse mx-auto"></div>
            </div>
            <div className="mt-6 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
              <p className="text-[#123458] font-semibold text-lg">Loading Dashboard...</p>
              <div className="mt-2 w-32 h-1 bg-[#D4C9BE] rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-[#123458] rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Enhanced Dashboard Overview Card */}
            <div className="bg-gradient-to-br from-white via-[#f4f7fa] to-white rounded-2xl shadow-xl border border-[#B8C8D9]/30 overflow-hidden">
              <div className="bg-gradient-to-r from-[#123458] to-[#B8C8D9] p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                    <p className="text-white/80">Your alumni portal at a glance</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {dashboardData && <DashboardStats stats={dashboardData} />}
              </div>
            </div>

            {/* Enhanced Grid Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Recent Projects Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-[#D4C9BE]/40 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="bg-gradient-to-r from-[#D4C9BE] to-[#B8C8D9] p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-5 h-5 text-[#123458]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-[#123458]">Recent Projects</h3>
                    </div>
                    <button
                      onClick={handleProjectCreation}
                      className="px-6 py-2.5 bg-[#123458] text-white rounded-xl hover:bg-[#123458]/90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                    >
                      + Add Project
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-5">
                    {projects.slice(0, 3).map((project) => (
                      <div key={project._id} className="transform hover:scale-[1.02] transition-transform duration-200">
                        <ProjectCard project={project} />
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-[#f4f7fa] rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-[#B8C8D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <p className="text-[#B8C8D9] text-lg mb-4">No projects yet</p>
                        <p className="text-[#123458]/60">Create your first project to get started!</p>
                      </div>
                    )}
                    {projects.length > 3 && (
                      <Link
                        to="/alumni/projects"
                        className="flex items-center justify-center space-x-2 text-[#123458] hover:text-[#B8C8D9] font-semibold py-3 px-4 rounded-xl hover:bg-[#f4f7fa] transition-all duration-200 group"
                      >
                        <span>View all projects</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
{/* Recent Internships Section */}
<div className="bg-white rounded-2xl shadow-xl border border-[#D4C9BE]/40 overflow-hidden group hover:shadow-2xl transition-all duration-300">
  <div className="bg-gradient-to-r from-[#B8C8D9] to-[#D4C9BE] p-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <svg className="w-5 h-5 text-[#123458]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v.5M8 6v.5m8 0a.5.5 0 01-.5.5H8.5A.5.5 0 018 7v0c0-.276.224-.5.5-.5h7c.276 0 .5.224.5.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#123458]">Recent Internships</h3>
      </div>
      <button
        onClick={handleInternshipCreation}
        className="px-6 py-2.5 bg-[#123458] text-white rounded-xl hover:bg-[#123458]/90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
      >
        + Add Internship
      </button>
    </div>
  </div>
  <div className="p-6">
    <div className="space-y-5">
      {internships.slice(0, 2).map((internship) => (
        <div key={internship._id} className="transform hover:scale-[1.02] transition-transform duration-200">
          <InternshipCard internship={internship} />
        </div>
      ))}
      {internships.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#f4f7fa] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#B8C8D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-[#B8C8D9] text-lg mb-4">No internships yet</p>
          <p className="text-[#123458]/60">Create your first internship opportunity!</p>
        </div>
      )}
      {internships.length > 0 && (
        <Link
          to="/alumni/internships"
          className="flex items-center justify-center space-x-2 text-[#123458] hover:text-[#B8C8D9] font-semibold py-3 px-4 rounded-xl hover:bg-[#f4f7fa] transition-all duration-200 group"
        >
          <span>View all internships</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  </div>
</div>
            </div>

            {/* Enhanced Pending Applications Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-[#D4C9BE]/40 overflow-hidden">
              <div className="bg-gradient-to-r from-[#123458]/10 to-[#B8C8D9]/20 p-6 border-b border-[#D4C9BE]/30">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#123458]/10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#123458]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#123458]">Pending Applications</h3>
                  </div>
                  <Link
                    to="/alumni/applications"
                    className="text-[#123458] hover:text-[#B8C8D9] font-semibold px-4 py-2 rounded-lg hover:bg-[#f4f7fa] transition-all duration-200"
                  >
                    View all →
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-[#f4f7fa] border-b border-[#D4C9BE]/30">
                      <th className="py-4 px-6 text-left text-[#123458] font-semibold">Student</th>
                      <th className="py-4 px-6 text-left text-[#123458] font-semibold">Opportunity</th>
                      <th className="py-4 px-6 text-left text-[#123458] font-semibold">Type</th>
                      <th className="py-4 px-6 text-left text-[#123458] font-semibold">Date</th>
                      <th className="py-4 px-6 text-left text-[#123458] font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.slice(0, 5).map((application, index) => (
                      <tr key={application._id} className={`border-b border-[#D4C9BE]/20 hover:bg-[#f4f7fa]/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-[#f4f7fa]/20'}`}>
                        <ApplicationRow
                          application={application}
                          onAction={handleApplicationAction}
                        />
                      </tr>
                    ))}
                    {applications.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-12 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-[#f4f7fa] rounded-full flex items-center justify-center mb-3">
                              <svg className="w-6 h-6 text-[#B8C8D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <p className="text-[#B8C8D9] font-medium">No pending applications</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Enhanced Pending Submissions Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-[#D4C9BE]/40 overflow-hidden">
              <div className="bg-gradient-to-r from-[#B8C8D9]/20 to-[#D4C9BE]/20 p-6 border-b border-[#D4C9BE]/30">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#B8C8D9]/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#123458]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#123458]">Pending Submissions</h3>
                  </div>
                  <Link
                    to="/alumni/submissions"
                    className="text-[#123458] hover:text-[#B8C8D9] font-semibold px-4 py-2 rounded-lg hover:bg-[#f4f7fa] transition-all duration-200"
                  >
                    View all →
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-[#f4f7fa] border-b border-[#D4C9BE]/30">
                      <th className="py-4 px-6 text-left text-[#123458] font-semibold">Project</th>
                      <th className="py-4 px-6 text-left text-[#123458] font-semibold">Student</th>
                      <th className="py-4 px-6 text-left text-[#123458] font-semibold">Date</th>
                      <th className="py-4 px-6 text-left text-[#123458] font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingSubmissions.slice(0, 5).map((submission, index) => (
                      <tr key={submission._id} className={`border-b border-[#D4C9BE]/20 hover:bg-[#f4f7fa]/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-[#f4f7fa]/20'}`}>
                        <td className="py-4 px-6 text-[#123458] font-medium">
                          {submission.project.title}
                        </td>
                        <td className="py-4 px-6 text-[#123458]/80">
                          {submission.student.name}
                        </td>
                        <td className="py-4 px-6 text-[#123458]/60">
                          {new Date(submission.submissionDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <Link
                              to={`/alumni/submissions/${submission._id}`}
                              className="px-4 py-2 bg-[#B8C8D9] text-[#123458] rounded-lg hover:bg-[#B8C8D9]/80 font-medium transition-all duration-200 hover:shadow-md"
                            >
                              View
                            </Link>
                            <button
                              onClick={() =>
                                handleSubmissionAction(submission._id, "Accepted")
                              }
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition-all duration-200 hover:shadow-md"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleSubmissionAction(submission._id, "Rejected")
                              }
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-all duration-200 hover:shadow-md"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {pendingSubmissions.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-12 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-[#f4f7fa] rounded-full flex items-center justify-center mb-3">
                              <svg className="w-6 h-6 text-[#B8C8D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            <p className="text-[#B8C8D9] font-medium">No pending submissions</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case "calls":
        return <VideoCall />;
        
      case "projects":
        return (
          <div className="bg-white rounded-2xl shadow-xl border border-[#D4C9BE]/40 overflow-hidden">
            <div className="bg-gradient-to-r from-[#123458] to-[#B8C8D9] p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">My Projects</h2>
                    <p className="text-white/80">Manage and track your project offerings</p>
                  </div>
                </div>
                <button
                  onClick={handleProjectCreation}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl font-medium border border-white/20"
                >
                  + Create New Project
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <div
                    key={project._id}
                    className="group relative bg-gradient-to-br from-white to-[#f4f7fa] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#D4C9BE]/30 overflow-hidden transform hover:scale-[1.02]"
                  >
                    {/* Project Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          project.status === "Open"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : project.status === "Occupied"
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>

                    {/* Project Card Header */}
                    <div className="bg-gradient-to-r from-[#D4C9BE]/20 to-[#B8C8D9]/20 p-6 border-b border-[#D4C9BE]/20">
                      <h3 className="font-bold text-xl mb-2 text-[#123458] truncate pr-16">
                        {project.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-[#123458]/60">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Created recently</span>
                      </div>
                    </div>

                    {/* Project Card Body */}
                    <div className="p-6">
                      <p className="text-[#123458]/80 mb-4 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                      
                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.skills.slice(0, 3).map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-3 py-1 bg-[#B8C8D9]/20 text-[#123458] text-xs rounded-full border border-[#B8C8D9]/30 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {project.skills.length > 3 && (
                          <span className="px-3 py-1 bg-[#D4C9BE]/20 text-[#123458]/60 text-xs rounded-full border border-[#D4C9BE]/30">
                            +{project.skills.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      <Link
                        to={`/alumni/projects/${project._id}`}
                        className="block w-full text-center py-3 bg-gradient-to-r from-[#123458] to-[#B8C8D9] text-white rounded-xl hover:from-[#123458]/90 hover:to-[#B8C8D9]/90 font-semibold transition-all duration-200 transform group-hover:shadow-lg"
                      >
                        View Details
                      </Link>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#123458]/5 to-[#B8C8D9]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                ))}
                
                {/* Empty State */}
                {projects.length === 0 && (
                  <div className="col-span-full">
                    <div className="text-center py-20 bg-gradient-to-br from-[#f4f7fa] to-white rounded-2xl border-2 border-dashed border-[#D4C9BE]/50">
                      <div className="w-24 h-24 bg-[#B8C8D9]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-[#B8C8D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-[#123458] mb-4">No Projects Yet</h3>
                      <p className="text-[#123458]/60 mb-8 max-w-md mx-auto">
                        Start your journey by creating your first project. Share your expertise and help students grow!
                      </p>
                      <button
                        onClick={handleProjectCreation}
                        className="px-8 py-4 bg-gradient-to-r from-[#123458] to-[#B8C8D9] text-white rounded-xl hover:from-[#123458]/90 hover:to-[#B8C8D9]/90 font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Create Your First Project
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );


      case "internships":
        return (
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-xl border border-slate-200 p-8">
            {/* Header Section with Gradient Background */}
            <div className="bg-gradient-to-r from-[#123458] to-[#2a4a7a] rounded-xl p-6 mb-8 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Internship Hub</h2>
                  <p className="text-blue-100 text-sm">Manage and track your internship opportunities</p>
                </div>
                <button
                  onClick={handleInternshipCreation}
                  className="px-6 py-3 bg-[#D4C9BE] text-[#123458] rounded-xl hover:bg-[#c4b9ae] font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  + New Internship
                </button>
              </div>
            </div>

            {/* Internships Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {internships.map((internship) => (
                <div
                  key={internship._id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#B8C8D9]/30 hover:border-[#B8C8D9] transform hover:-translate-y-1"
                >
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        internship.status === "Open"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : internship.status === "Occupied"
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {internship.status}
                    </span>
                  </div>

                  {/* Title and Company */}
                  <div className="mb-4">
                    <h3 className="font-bold text-xl text-[#123458] mb-2 line-clamp-2">
                      {internship.title}
                    </h3>
                    <p className="text-[#B8C8D9] font-medium text-sm bg-[#f4f7fa] px-3 py-1 rounded-lg inline-block">
                      {internship.company}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {internship.description}
                  </p>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {internship.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-[#B8C8D9] to-[#D4C9BE] text-[#123458] text-xs rounded-full font-medium shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {internship.skills.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                        +{internship.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Details Section */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-[#123458] rounded-full mr-3"></span>
                      <span className="font-medium text-[#123458]">Location:</span>
                      <span className="ml-2 text-gray-600">
                        {internship.location}
                        {internship.isRemote && (
                          <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Remote
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-[#B8C8D9] rounded-full mr-3"></span>
                      <span className="font-medium text-[#123458]">Duration:</span>
                      <span className="ml-2 text-gray-600">{internship.duration}</span>
                    </div>
                    {internship.stipend && (
                      <div className="flex items-center text-sm">
                        <span className="w-2 h-2 bg-[#D4C9BE] rounded-full mr-3"></span>
                        <span className="font-medium text-[#123458]">Stipend:</span>
                        <span className="ml-2 text-gray-600">{internship.stipend}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/alumni/internships/${internship._id}`}
                    className="block w-full text-center py-3 bg-gradient-to-r from-[#123458] to-[#2a4a7a] text-white rounded-xl hover:from-[#2a4a7a] hover:to-[#123458] font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    View Details →
                  </Link>
                </div>
              ))}

              {/* Empty State */}
              {internships.length === 0 && (
                <div className="col-span-full">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-dashed border-[#B8C8D9]">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#B8C8D9] to-[#D4C9BE] rounded-full mx-auto mb-6 flex items-center justify-center">
                      <span className="text-2xl text-[#123458]">💼</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#123458] mb-3">No Internships Yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Start building your network by creating your first internship opportunity
                    </p>
                    <button
                      onClick={handleInternshipCreation}
                      className="px-8 py-3 bg-gradient-to-r from-[#123458] to-[#2a4a7a] text-white rounded-xl hover:from-[#2a4a7a] hover:to-[#123458] font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Create First Internship
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "applications":
        return (
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-xl border border-slate-200 p-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#123458] to-[#2a4a7a] rounded-xl p-6 mb-8 text-white">
              <h2 className="text-2xl font-bold mb-2">Application Management</h2>
              <p className="text-blue-100 text-sm">Review and manage student applications</p>
            </div>

            {/* Table Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#B8C8D9]/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#f4f7fa] to-[#B8C8D9]/20 border-b border-[#B8C8D9]/30">
                      <th className="py-4 px-6 text-left font-bold text-[#123458] uppercase tracking-wide text-sm">
                        Student
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-[#123458] uppercase tracking-wide text-sm">
                        Opportunity
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-[#123458] uppercase tracking-wide text-sm">
                        Type
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-[#123458] uppercase tracking-wide text-sm">
                        Status
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-[#123458] uppercase tracking-wide text-sm">
                        Date
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-[#123458] uppercase tracking-wide text-sm">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#B8C8D9]/20">
                    {applications.map((application) => (
                      <ApplicationRow
                        key={application._id}
                        application={application}
                        onAction={handleApplicationAction}
                        showStatus={true}
                      />
                    ))}
                    {applications.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-16 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#B8C8D9] to-[#D4C9BE] rounded-full mb-4 flex items-center justify-center">
                              <span className="text-2xl text-[#123458]">📋</span>
                            </div>
                            <h3 className="text-lg font-semibold text-[#123458] mb-2">No Applications Found</h3>
                            <p className="text-gray-500">Applications will appear here when students apply</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "submissions":
        return (
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-xl border border-slate-200 p-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#123458] to-[#2a4a7a] rounded-xl p-6 mb-8 text-white">
              <h2 className="text-2xl font-bold mb-2">Project Submissions</h2>
              <p className="text-blue-100 text-sm">Review and evaluate student project submissions</p>
            </div>

            {/* Table Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#B8C8D9]/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#f4f7fa] to-[#B8C8D9]/20 border-b border-[#B8C8D9]/30">
                      <th className="py-4 px-6 text-left font-bold text-[#123458] uppercase tracking-wide text-sm">
                        Project
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-[#123458] uppercase tracking-wide text-sm">
                        Student
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-[#123458] uppercase tracking-wide text-sm">
                        Status
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-[#123458] uppercase tracking-wide text-sm">
                        Submission Date
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-[#123458] uppercase tracking-wide text-sm">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#B8C8D9]/20">
                    {pendingSubmissions.map((submission) => (
                      <tr key={submission._id} className="hover:bg-[#f4f7fa]/50 transition-colors duration-200">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-[#123458]">
                            {submission.project.title}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#B8C8D9] to-[#D4C9BE] rounded-full flex items-center justify-center mr-3">
                              <span className="text-[#123458] font-bold text-sm">
                                {submission.student.name.charAt(0)}
                              </span>
                            </div>
                            <span className="text-gray-700 font-medium">
                              {submission.student.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                              submission.status === "Submitted"
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : submission.status === "Reviewed"
                                ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                : submission.status === "Accepted"
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-red-100 text-red-700 border border-red-200"
                            }`}
                          >
                            {submission.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {new Date(submission.submissionDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <Link
                              to={`/alumni/submissions/${submission._id}`}
                              className="px-4 py-2 bg-gradient-to-r from-[#B8C8D9] to-[#D4C9BE] text-[#123458] rounded-lg font-semibold text-sm hover:from-[#a8b8c9] hover:to-[#c4b9ae] transition-all duration-200 transform hover:scale-105"
                            >
                              View
                            </Link>
                            {submission.status === "Submitted" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleSubmissionAction(
                                      submission._id,
                                      "Accepted",
                                      "Great work!"
                                    )
                                  }
                                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() =>
                                    handleSubmissionAction(
                                      submission._id,
                                      "Rejected",
                                      "Please revise and resubmit."
                                    )
                                  }
                                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {pendingSubmissions.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-16 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#B8C8D9] to-[#D4C9BE] rounded-full mb-4 flex items-center justify-center">
                              <span className="text-2xl text-[#123458]">📝</span>
                            </div>
                            <h3 className="text-lg font-semibold text-[#123458] mb-2">No Submissions Found</h3>
                            <p className="text-gray-500">Project submissions will appear here for review</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-xl border border-slate-200 p-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#123458] to-[#2a4a7a] rounded-xl p-6 mb-8 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Notifications Center</h2>
                  <p className="text-blue-100 text-sm">Stay updated with the latest activities</p>
                </div>
                {notifications.filter((n) => !n.read).length > 0 && (
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
                      {notifications.filter((n) => !n.read).length} unread
                    </span>
                    <button
                      onClick={handleMarkAllNotificationsRead}
                      className="px-6 py-3 bg-[#D4C9BE] text-[#123458] rounded-xl hover:bg-[#c4b9ae] font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Mark All Read
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Notifications Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#B8C8D9]/30 p-6">
              <NotificationList
                notifications={notifications}
                onNotificationClick={(notificationId) => {
                  // Handle notification click
                  // You can navigate to the relevant item based on notification type
                }}
              />
              {notifications.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#B8C8D9] to-[#D4C9BE] rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-3xl text-[#123458]">🔔</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#123458] mb-3">All Caught Up!</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    No new notifications at the moment. We'll notify you when there's something important.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      // Add this case to your renderContent() switch statement
      case "connections":
        return (
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-xl border border-slate-200 p-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#123458] to-[#2a4a7a] rounded-xl p-6 mb-8 text-white">
              <h2 className="text-2xl font-bold mb-2">Connection Requests</h2>
              <p className="text-blue-100 text-sm">Manage student connection requests and view your network</p>
            </div>

            {/* Connection Requests Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#B8C8D9]/30 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-[#f4f7fa] to-[#B8C8D9]/20 px-6 py-4 border-b border-[#B8C8D9]/30">
                <h3 className="text-lg font-bold text-[#123458]">Pending Requests</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#f4f7fa] to-[#B8C8D9]/10 border-b border-[#B8C8D9]/20">
                      <th className="py-4 px-6 text-left font-bold text-[#123458] uppercase tracking-wide text-sm">
                        Student
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-[#123458] uppercase tracking-wide text-sm">
                        Email
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-[#123458] uppercase tracking-wide text-sm">
                        Message
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-[#123458] uppercase tracking-wide text-sm">
                        Date
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-[#123458] uppercase tracking-wide text-sm">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#B8C8D9]/20">
                    {connectionRequests.map((request) => (
                      <tr key={request._id} className="hover:bg-[#f4f7fa]/50 transition-colors duration-200">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#B8C8D9] to-[#D4C9BE] rounded-full flex items-center justify-center mr-3">
                              <span className="text-[#123458] font-bold text-sm">
                                {request.sender.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-[#123458]">
                                {request.sender.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-gray-600 font-medium">
                            {request.sender.email}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="max-w-xs">
                            <p className="text-gray-700 text-sm line-clamp-2">
                              {request.message || "No message provided"}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleConnectionAction(request._id, "accepted")
                              }
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleConnectionAction(request._id, "rejected")
                              }
                              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {connectionRequests.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-16 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#B8C8D9] to-[#D4C9BE] rounded-full mb-4 flex items-center justify-center">
                              <span className="text-2xl text-[#123458]">🤝</span>
                            </div>
                            <h3 className="text-lg font-semibold text-[#123458] mb-2">No Pending Requests</h3>
                            <p className="text-gray-500">Connection requests will appear here</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Connected Students Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#B8C8D9]/30 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#123458] mb-1">Connected Students</h3>
                  <p className="text-gray-600 text-sm">Your professional network</p>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-[#B8C8D9] to-[#D4C9BE] text-[#123458] rounded-lg font-semibold">
                  {dashboardData?.connections?.length || 0} Connections
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData?.connections?.map((connection) => (
                  <div
                    key={connection._id}
                    className="bg-white rounded-xl p-6 shadow-lg border border-[#B8C8D9]/20 hover:shadow-xl hover:border-[#B8C8D9] transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#123458] to-[#2a4a7a] flex items-center justify-center text-white font-bold text-lg mr-4">
                        {connection.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[#123458] text-lg">
                          {connection.name}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {connection.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/alumni/chats/${connection.chatId}`}
                      className="block w-full text-center py-3 bg-gradient-to-r from-[#123458] to-[#2a4a7a] text-white rounded-xl hover:from-[#2a4a7a] hover:to-[#123458] font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      💬 Message
                    </Link>
                  </div>
                ))}
                {(!dashboardData?.connections ||
                  dashboardData.connections.length === 0) && (
                  <div className="col-span-full">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-dashed border-[#B8C8D9]">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#B8C8D9] to-[#D4C9BE] rounded-full mx-auto mb-6 flex items-center justify-center">
                        <span className="text-2xl text-[#123458]">👥</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#123458] mb-3">No Connections Yet</h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Start building your network by accepting connection requests from students
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "messages":
        return (
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-xl border border-slate-200 p-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#123458] to-[#2a4a7a] rounded-xl p-6 mb-8 text-white">
              <h2 className="text-2xl font-bold mb-2">Messages</h2>
              <p className="text-blue-100 text-sm">Communicate with your connected students</p>
            </div>

            {/* Chat Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#B8C8D9]/30 p-6">
              <AlumniChatList />
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-xl border border-slate-200 p-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#123458] to-[#2a4a7a] rounded-xl p-6 mb-8 text-white">
              <h2 className="text-2xl font-bold mb-2">Profile Settings</h2>
              <p className="text-blue-100 text-sm">Manage your professional profile and account settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#B8C8D9]/30 p-8 text-center">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#123458] to-[#2a4a7a] flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-xl">
                      {user?.name?.charAt(0)}
                    </div>
                    <div className="absolute bottom-2 right-1/4 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#123458] mb-2">
                    {user?.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{user?.email}</p>
                  
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#B8C8D9] to-[#D4C9BE] text-[#123458] rounded-full font-bold text-sm shadow-md">
                    <span className="w-2 h-2 bg-[#123458] rounded-full mr-2"></span>
                    Alumni Member
                  </div>

                  {formData.company && (
                    <div className="mt-4 p-4 bg-[#f4f7fa] rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">Current Position</div>
                      <div className="font-semibold text-[#123458]">{formData.company}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Form */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#B8C8D9]/30 p-8">
                  <form
                    className="space-y-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveProfileChanges();
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[#123458] mb-2">
                          Full Name
                        </label>
                        <input
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="w-full border-2 border-[#B8C8D9]/30 rounded-xl px-4 py-3 focus:border-[#123458] focus:ring-2 focus:ring-[#123458]/20 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-[#123458] mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={user?.email}
                          disabled
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                          Email cannot be changed
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#123458] mb-2">
                        Professional Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell students about your experience, expertise, and what you can offer as a mentor..."
                        className="w-full border-2 border-[#B8C8D9]/30 rounded-xl px-4 py-3 h-32 focus:border-[#123458] focus:ring-2 focus:ring-[#123458]/20 transition-all duration-200 resize-none"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[#123458] mb-2">
                          Current Company
                        </label>
                        <input
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Where do you work?"
                          className="w-full border-2 border-[#B8C8D9]/30 rounded-xl px-4 py-3 focus:border-[#123458] focus:ring-2 focus:ring-[#123458]/20 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-[#123458] mb-2">
                          LinkedIn Profile
                        </label>
                        <input
                          name="linkedin"
                          type="url"
                          value={formData.linkedin}
                          onChange={handleChange}
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="w-full border-2 border-[#B8C8D9]/30 rounded-xl px-4 py-3 focus:border-[#123458] focus:ring-2 focus:ring-[#123458]/20 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-[#B8C8D9]/30">
                      <button
                        type="submit"
                        className="px-8 py-3 bg-gradient-to-r from-[#123458] to-[#2a4a7a] text-white rounded-xl hover:from-[#2a4a7a] hover:to-[#123458] font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        💾 Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-xl border border-slate-200 p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#B8C8D9] to-[#D4C9BE] rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-3xl text-[#123458]">🚀</span>
            </div>
            <h3 className="text-2xl font-bold text-[#123458] mb-3">Welcome to Your Dashboard</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Select a tab from the sidebar to get started with managing your alumni activities
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notificationCount={notifications.filter((n) => !n.read).length}
        unreadMessageCount={dashboardData?.unreadMessageCount || 0}
      />

      {/* Main Content Area */}
      <div className="flex-grow p-8 ml-64">
        {/* Top Header Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#B8C8D9]/30 p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#123458] mb-1">Alumni Dashboard</h1>
              <p className="text-gray-600">Manage your mentorship and networking activities</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Welcome back,</div>
                <div className="font-bold text-[#123458]">{user?.name}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#123458] to-[#2a4a7a] flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)}
              </div>
              
<button
  onClick={logout}
  className="px-6 py-3 bg-gradient-to-r from-[#123458] to-[#1e4a73] text-white rounded-xl hover:from-[#1e4a73] hover:to-[#2a5a8a] font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 border border-[#B8C8D9] border-opacity-30 hover:border-opacity-50"
>
  🚪 Logout
</button>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default AlumniDashboard;

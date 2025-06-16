// // import React, { useState, useEffect } from "react";
// // import { Routes, Route, Link, useNavigate } from "react-router-dom";
// // import {
// //   FaHome,
// //   FaProjectDiagram,
// //   FaBriefcase,
// //   FaEnvelope,
// //   FaBell,
// //   FaUser,
// //   FaSignOutAlt,
// //   FaSearch,
// //   FaVideo,
// // } from "react-icons/fa";
// // import ProjectList from "../components/student/ProjectList";
// // import InternshipList from "../components/student/InternshipList";
// // import ApplicationList from "../components/student/ApplicationList";
// // import ChatList from "../components/student/ChatList";
// // import Notifications from "../components/student/Notifications";
// // import StudentProfile from "../components/student/StudentProfile";
// // import StudentPortfolio from "../components/student/StudentPortfolio";
// // import InternshipDetail from "../components/student/InternshipDetail";
// // import ApplicationDetail from "../components/student/ApplicationDetail";
// // import InternshipApply from "../components/student/InternshipApply";
// // import SearchAlumni from "../components/student/SearchAlumni";
// // import SubmissionPage from "../components/student/SubmissionPage";
// // import ApprovedProjects from "../components/student/ApprovedProjects";
// // import { useAuth } from "../context/AuthContext";
// // import api from "../services/api";
// // import ProjectDetail from "../components/student/ProjectDetail";
// // const StudentDashboard = () => {
// //   const { user, logout } = useAuth();
// //   const [notifications, setNotifications] = useState([]);
// //   const [unreadCount, setUnreadCount] = useState(0);
// //   const navigate = useNavigate();

// //   return (
// //     <div className="flex h-screen bg-gray-100">
// //       {/* Sidebar */}
// //       <div className="w-64 bg-indigo-800 text-white">
// //         <div className="p-4">
// //           <h1 className="text-2xl font-bold">Student Portal</h1>
// //           <p className="mt-0 text-indigo-200">
// //             Welcome, {user?.name || "Student"}
// //           </p>
// //         </div>
// //         <nav className="mt-0">
// //           <div className="px-4 space-y-1">
// //             <Link
// //               to="/student"
// //               className="flex items-center py-2 px-4 rounded hover:bg-indigo-700"
// //             >
// //               <FaHome className="mr-3" /> Dashboard
// //             </Link>
// //             <Link
// //               to="/student/projects"
// //               className="flex items-center py-2 px-4 rounded hover:bg-indigo-700"
// //             >
// //               <FaProjectDiagram className="mr-3" /> Projects
// //             </Link>
// //             <Link
// //               to="/student/projects/approved"
// //               className="flex items-center py-2 px-4 rounded hover:bg-indigo-700"
// //             >
// //               <FaProjectDiagram className="mr-3" /> Approved Projects
// //             </Link>
// //             <Link
// //               to="/student/internships"
// //               className="flex items-center py-2 px-4 rounded hover:bg-indigo-700"
// //             >
// //               <FaBriefcase className="mr-3" /> Internships
// //             </Link>
// //             <Link
// //               to="/student/applications"
// //               className="flex items-center py-2 px-4 rounded hover:bg-indigo-700"
// //             >
// //               <FaUser className="mr-3" /> My Applications
// //             </Link>
// //             <Link
// //               to="/student/video-calls"
// //               className="flex items-center py-2 px-4 rounded hover:bg-indigo-700"
// //             >
// //               <FaVideo className="mr-3" /> Video Calls
// //             </Link>
// //             <Link
// //               to="/student/search"
// //               className="flex items-center py-2 px-4 rounded hover:bg-indigo-700"
// //             >
// //               <FaSearch className="mr-3" /> Search Alumni
// //             </Link>
// //             <Link
// //               to="/student/chats"
// //               className="flex items-center py-2 px-4 rounded hover:bg-indigo-700"
// //             >
// //               <FaEnvelope className="mr-3" /> Messages
// //             </Link>
// //             <Link
// //               to="/student/notifications"
// //               className="flex items-center py-2 px-4 rounded hover:bg-indigo-700"
// //             >
// //               <FaBell className="mr-3" /> Notifications
// //               {unreadCount > 0 && (
// //                 <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
// //                   {unreadCount}
// //                 </span>
// //               )}
// //             </Link>
// //             <Link
// //               to="/student/profile"
// //               className="flex items-center py-2 px-4 rounded hover:bg-indigo-700"
// //             >
// //               <FaUser className="mr-3" /> My Profile
// //             </Link>
// //             <Link
// //               to="/student/portfolio"
// //               className="flex items-center py-2 px-4 rounded hover:bg-indigo-700"
// //             >
// //               <FaProjectDiagram className="mr-3" /> My Portfolio
// //             </Link>
// //             <button
// //               onClick={logout}
// //               className="flex items-center w-full text-left py-2 px-4 rounded hover:bg-indigo-700"
// //             >
// //               <FaSignOutAlt className="mr-3" /> Logout
// //             </button>
// //           </div>
// //         </nav>
// //       </div>

// //       {/* Main Content */}
// //       <div className="flex-1 overflow-y-auto">
// //         <div className="p-6">
// //           <Routes>
// //             <Route path="/" element={<StudentHome user={user} />} />
// //             <Route path="/projects" element={<ProjectList />} />
// //             <Route
// //               path="/projects/submissions/:id"
// //               element={<SubmissionPage />}
// //             />
// //             <Route path="/projects/approved" element={<ApprovedProjects />} />
// //             <Route path="/projects/:id" element={<ProjectDetail />} />
// //             <Route path="/internships" element={<InternshipList />} />
// //             <Route path="/internships/:id" element={<InternshipDetail />} />
// //             <Route path="/search" element={<SearchAlumni />} />

// //             <Route
// //               path="/internships/apply/:id"
// //               element={<InternshipApply />}
// //             />
// //             <Route path="/applications" element={<ApplicationList />} />
// //             <Route path="/applications/:id" element={<ApplicationDetail />} />
// //             <Route path="/chats" element={<ChatList />} />
// //             <Route path="/notifications" element={<Notifications />} />
// //             <Route path="/profile" element={<StudentProfile user={user} />} />
// //             <Route
// //               path="/portfolio"
// //               element={<StudentPortfolio user={user} />}
// //             />
// //           </Routes>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // Student Home Component
// // const StudentHome = ({ user }) => {
// //   const [stats, setStats] = useState({
// //     applications: 0,
// //     activeProjects: 0,
// //     completedProjects: 0,
// //     unreadMessages: 0,
// //   });

// //   useEffect(() => {
// //     const fetchStats = async () => {
// //       try {
// //         const token = localStorage.getItem("token");
// //         const applicationsRes = await api.get("/student/applications");

// //         const chatRes = await api.get("/student/chats");

// //         // Calculate unread messages
// //         let unreadCount = 0;
// //         chatRes.data.forEach((chat) => {
// //           chat.messages.forEach((message) => {
// //             if (!message.read && message.sender !== user._id) {
// //               unreadCount++;
// //             }
// //           });
// //         });

// //         // Calculate applications stats
// //         const applications = applicationsRes.data;
// //         const activeApps = applications.filter(
// //           (app) =>
// //             app.status === "Accepted" && app.opportunityType === "Project"
// //         );

// //         const completedApps = applications.filter((app) => {
// //           if (app.opportunityType !== "Project") return false;
// //           const project = app.opportunity;
// //           return project && project.status === "Completed";
// //         });

// //         setStats({
// //           applications: applications.length,
// //           activeProjects: activeApps.length,
// //           completedProjects: completedApps.length,
// //           unreadMessages: unreadCount,
// //         });
// //       } catch (error) {
// //         console.error("Error fetching stats:", error);
// //       }
// //     };

// //     if (user) {
// //       fetchStats();
// //     }
// //   }, [user]);

// //   return (
// //     <div>
// //       <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

// //       {/* Stats Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //         <div className="bg-white rounded-lg shadow p-6">
// //           <div className="flex items-center">
// //             <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
// //               <FaProjectDiagram className="text-xl" />
// //             </div>
// //             <div className="ml-4">
// //               <p className="text-sm text-gray-500">Applications</p>
// //               <p className="text-2xl font-semibold">{stats.applications}</p>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-lg shadow p-6">
// //           <div className="flex items-center">
// //             <div className="p-3 rounded-full bg-green-100 text-green-600">
// //               <FaProjectDiagram className="text-xl" />
// //             </div>
// //             <div className="ml-4">
// //               <p className="text-sm text-gray-500">Active Projects</p>
// //               <p className="text-2xl font-semibold">{stats.activeProjects}</p>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-lg shadow p-6">
// //           <div className="flex items-center">
// //             <div className="p-3 rounded-full bg-blue-100 text-blue-600">
// //               <FaProjectDiagram className="text-xl" />
// //             </div>
// //             <div className="ml-4">
// //               <p className="text-sm text-gray-500">Completed Projects</p>
// //               <p className="text-2xl font-semibold">
// //                 {stats.completedProjects}
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-lg shadow p-6">
// //           <div className="flex items-center">
// //             <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
// //               <FaEnvelope className="text-xl" />
// //             </div>
// //             <div className="ml-4">
// //               <p className="text-sm text-gray-500">Unread Messages</p>
// //               <p className="text-2xl font-semibold">{stats.unreadMessages}</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Recent Activities */}
// //       <div className="bg-white rounded-lg shadow mb-8">
// //         <div className="border-b px-6 py-4">
// //           <h2 className="text-lg font-semibold">Recent Activities</h2>
// //         </div>
// //         <div className="p-6">
// //           <RecentActivities user={user} />
// //         </div>
// //       </div>

// //       {/* Project Recommendations */}
// //       <div className="bg-white rounded-lg shadow">
// //         <div className="border-b px-6 py-4">
// //           <h2 className="text-lg font-semibold">Recommended Projects</h2>
// //         </div>
// //         <div className="p-6">
// //           <ProjectRecommendations user={user} />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // Recent Activities Component
// // const RecentActivities = ({ user }) => {
// //   const [activities, setActivities] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchActivities = async () => {
// //       try {
// //         const token = localStorage.getItem("token");

// //         // Get notifications as activities
// //         const notificationsRes = await api.get("/student/notifications");

// //         setActivities(notificationsRes.data.slice(0, 5));
// //         setLoading(false);
// //       } catch (error) {
// //         console.error("Error fetching activities:", error);
// //         setLoading(false);
// //       }
// //     };

// //     if (user) {
// //       fetchActivities();
// //     }
// //   }, [user]);

// //   if (loading) {
// //     return <p className="text-gray-500">Loading activities...</p>;
// //   }

// //   if (activities.length === 0) {
// //     return <p className="text-gray-500">No recent activities found.</p>;
// //   }

// //   return (
// //     <div className="space-y-4">
// //       {activities.map((activity) => (
// //         <div
// //           key={activity._id}
// //           className="border-l-4 border-indigo-500 pl-4 py-2"
// //         >
// //           <p className="font-medium">{activity.title}</p>
// //           <p className="text-gray-600">{activity.message}</p>
// //           <p className="text-xs text-gray-400">
// //             {new Date(activity.createdAt).toLocaleString()}
// //           </p>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // // Project Recommendations Component
// // const ProjectRecommendations = ({ user }) => {
// //   const [projects, setProjects] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchRecommendations = async () => {
// //       try {
// //         if (!user) return;

// //         const token = localStorage.getItem("token");

// //         // Get student skills
// //         const studentRes = await api.get(`/user/profile`);

// //         const skills = studentRes.data.skills || [];

// //         // Get projects with matching skills
// //         const projectsRes = await api.get("/student/projects", {
// //           params: { skills: skills.join(",") },
// //         });

// //         setProjects(projectsRes.data.slice(0, 3));
// //         setLoading(false);
// //       } catch (error) {
// //         console.error("Error fetching recommendations:", error);
// //         setLoading(false);
// //       }
// //     };

// //     fetchRecommendations();
// //   }, [user]);

// //   if (loading) {
// //     return <p className="text-gray-500">Loading recommendations...</p>;
// //   }

// //   if (projects.length === 0) {
// //     return (
// //       <p className="text-gray-500">
// //         No project recommendations found. Update your skills to get matched with
// //         projects.
// //       </p>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6">
// //       {projects.map((project) => (
// //         <div
// //           key={project._id}
// //           className="border-b pb-4 last:border-b-0 last:pb-0"
// //         >
// //           <h3 className="font-medium text-lg mb-1">{project.title}</h3>
// //           <p className="text-gray-600 mb-2 line-clamp-2">
// //             {project.description}
// //           </p>
// //           <div className="flex flex-wrap gap-2 mb-3">
// //             {project.skills.map((skill, index) => (
// //               <span
// //                 key={index}
// //                 className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded"
// //               >
// //                 {skill}
// //               </span>
// //             ))}
// //           </div>
// //           <div className="flex justify-between items-center">
// //             <span className="text-sm text-gray-500">
// //               Posted by: {project.alumni ? project.alumni.name : "Alumni"}
// //             </span>
// //             <Link
// //               to={`/student/projects/${project._id}`}
// //               className="text-sm text-indigo-600 hover:text-indigo-800"
// //             >
// //               View Details
// //             </Link>
// //           </div>
// //         </div>
// //       ))}
// //       <div className="text-center mt-4">
// //         <Link
// //           to="/student/projects"
// //           className="text-indigo-600 hover:text-indigo-800 font-medium"
// //         >
// //           View All Projects
// //         </Link>
// //       </div>
// //     </div>
// //   );
// // };

// // export default StudentDashboard;
































import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaProjectDiagram,
  FaBriefcase,
  FaEnvelope,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaSearch,
  FaVideo,
} from "react-icons/fa";
import ProjectList from "../components/student/ProjectList";
import InternshipList from "../components/student/InternshipList";
import ApplicationList from "../components/student/ApplicationList";
import ChatList from "../components/student/ChatList";
import Notifications from "../components/student/Notifications";
import StudentProfile from "../components/student/StudentProfile";
import StudentPortfolio from "../components/student/StudentPortfolio";
import InternshipDetail from "../components/student/InternshipDetail";
import ApplicationDetail from "../components/student/ApplicationDetail";
import InternshipApply from "../components/student/InternshipApply";
import SearchAlumni from "../components/student/SearchAlumni";
import SubmissionPage from "../components/student/SubmissionPage";
// import ApprovedProjects from "../components/student/ApprovedProjects";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import ProjectDetail from "../components/student/ProjectDetail";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  return (
  <div className="flex h-screen" style={{ backgroundColor: '#f4f7fa' }}>
      {/* Sidebar */}
      <div className="w-72 shadow-2xl relative overflow-hidden" style={{ backgroundColor: '#123458' }}>
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#D4C9BE' }}>
              <FaUser className="text-2xl" style={{ color: '#123458' }} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Student Portal</h1>
            <div className="px-4 py-2 rounded-full inline-block" style={{ backgroundColor: '#B8C8D9' }}>
              <p className="text-sm font-medium" style={{ color: '#123458' }}>
                Welcome, {user?.name || "Student"}
              </p>
            </div>
          </div>
        </div>
        
        <nav className="px-4 space-y-2 relative z-10 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-blue-400/30 scrollbar-track-transparent">
          <Link
            to="/student"
            className="flex items-center py-3 px-4 rounded-xl text-white hover:shadow-lg transition-all duration-300 group"
            style={{ backgroundColor: 'rgba(212, 201, 190, 0.1)' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#D4C9BE' }}>
              <FaHome style={{ color: '#123458' }} />
            </div>
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link
            to="/student/projects"
            className="flex items-center py-3 px-4 rounded-xl text-white hover:shadow-lg transition-all duration-300 group"
            style={{ backgroundColor: 'rgba(212, 201, 190, 0.1)' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#D4C9BE' }}>
              <FaProjectDiagram style={{ color: '#123458' }} />
            </div>
            <span className="font-medium">Projects</span>
          </Link>
          
          {/* <Link
            to="/student/projects/approved"
            className="flex items-center py-3 px-4 rounded-xl text-white hover:shadow-lg transition-all duration-300 group"
            style={{ backgroundColor: 'rgba(212, 201, 190, 0.1)' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#D4C9BE' }}>
              <FaProjectDiagram style={{ color: '#123458' }} />
            </div>
            <span className="font-medium">Approved Projects</span>
          </Link> */}
          
          <Link
            to="/student/internships"
            className="flex items-center py-3 px-4 rounded-xl text-white hover:shadow-lg transition-all duration-300 group"
            style={{ backgroundColor: 'rgba(212, 201, 190, 0.1)' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#D4C9BE' }}>
              <FaBriefcase style={{ color: '#123458' }} />
            </div>
            <span className="font-medium">Internships</span>
          </Link>
          
          <Link
            to="/student/applications"
            className="flex items-center py-3 px-4 rounded-xl text-white hover:shadow-lg transition-all duration-300 group"
            style={{ backgroundColor: 'rgba(212, 201, 190, 0.1)' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#D4C9BE' }}>
              <FaUser style={{ color: '#123458' }} />
            </div>
            <span className="font-medium">My Applications</span>
          </Link>
          
          <Link
            to="/student/video-calls"
            className="flex items-center py-3 px-4 rounded-xl text-white hover:shadow-lg transition-all duration-300 group"
            style={{ backgroundColor: 'rgba(212, 201, 190, 0.1)' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#D4C9BE' }}>
              <FaVideo style={{ color: '#123458' }} />
            </div>
            <span className="font-medium">Video Calls</span>
          </Link>
          
          <Link
            to="/student/search"
            className="flex items-center py-3 px-4 rounded-xl text-white hover:shadow-lg transition-all duration-300 group"
            style={{ backgroundColor: 'rgba(212, 201, 190, 0.1)' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#D4C9BE' }}>
              <FaSearch style={{ color: '#123458' }} />
            </div>
            <span className="font-medium">Search Alumni</span>
          </Link>
          
          <Link
            to="/student/chats"
            className="flex items-center py-3 px-4 rounded-xl text-white hover:shadow-lg transition-all duration-300 group"
            style={{ backgroundColor: 'rgba(212, 201, 190, 0.1)' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#D4C9BE' }}>
              <FaEnvelope style={{ color: '#123458' }} />
            </div>
            <span className="font-medium">Messages</span>
          </Link>
          
          <Link
            to="/student/notifications"
            className="flex items-center py-3 px-4 rounded-xl text-white hover:shadow-lg transition-all duration-300 group relative"
            style={{ backgroundColor: 'rgba(212, 201, 190, 0.1)' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#D4C9BE' }}>
              <FaBell style={{ color: '#123458' }} />
            </div>
            <span className="font-medium">Notifications</span>
            {unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                {unreadCount}
              </span>
            )}
          </Link>
          
          <Link
            to="/student/profile"
            className="flex items-center py-3 px-4 rounded-xl text-white hover:shadow-lg transition-all duration-300 group"
            style={{ backgroundColor: 'rgba(212, 201, 190, 0.1)' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#D4C9BE' }}>
              <FaUser style={{ color: '#123458' }} />
            </div>
            <span className="font-medium">My Profile</span>
          </Link>
          
          <Link
            to="/student/portfolio"
            className="flex items-center py-3 px-4 rounded-xl text-white hover:shadow-lg transition-all duration-300 group"
            style={{ backgroundColor: 'rgba(212, 201, 190, 0.1)' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#D4C9BE' }}>
              <FaProjectDiagram style={{ color: '#123458' }} />
            </div>
            <span className="font-medium">My Portfolio</span>
          </Link>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Header Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#B8C8D9]/30 p-6 m-8 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#123458] mb-1">Student Dashboard</h1>
              <p className="text-gray-600">Manage your academic journey and connect with opportunities</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Welcome back,</div>
                <div className="font-bold text-[#123458]">{user?.name || "Student"}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#123458] to-[#2a4a7a] flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || "S"}
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

        <div className="px-8 pb-8">
          <Routes>
            <Route path="/" element={<StudentHome user={user} />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route
              path="/projects/submissions/:id"
              element={<SubmissionPage />}
            />
            {/* <Route path="/projects/approved" element={<ApprovedProjects />} /> */}
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/internships" element={<InternshipList />} />
            <Route path="/internships/:id" element={<InternshipDetail />} />
            <Route path="/search" element={<SearchAlumni />} />

            <Route
              path="/internships/apply/:id"
              element={<InternshipApply />}
            />
            <Route path="/applications" element={<ApplicationList />} />
            <Route path="/applications/:id" element={<ApplicationDetail />} />
            <Route path="/chats" element={<ChatList />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<StudentProfile user={user} />} />
            <Route
              path="/portfolio"
              element={<StudentPortfolio user={user} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// Student Home Component
const StudentHome = ({ user }) => {
  const [stats, setStats] = useState({
    applications: 0,
    activeProjects: 0,
    completedProjects: 0,
    unreadMessages: 0,
  });

  // Mock chart data - in real app, this would come from API
  const applicationsData = [
    { name: 'Jan', value: 2 },
    { name: 'Feb', value: 5 },
    { name: 'Mar', value: 8 },
    { name: 'Apr', value: 12 },
    { name: 'May', value: 15 },
    { name: 'Jun', value: stats.applications },
  ];

  const projectsData = [
    { name: 'Jan', value: 1 },
    { name: 'Feb', value: 2 },
    { name: 'Mar', value: 3 },
    { name: 'Apr', value: 4 },
    { name: 'May', value: 5 },
    { name: 'Jun', value: stats.activeProjects },
  ];

  const completedProjectsData = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 1 },
    { name: 'Mar', value: 2 },
    { name: 'Apr', value: 3 },
    { name: 'May', value: 4 },
    { name: 'Jun', value: stats.completedProjects },
  ];

  const messagesData = [
    { name: 'Mon', value: 3 },
    { name: 'Tue', value: 7 },
    { name: 'Wed', value: 5 },
    { name: 'Thu', value: 9 },
    { name: 'Fri', value: 12 },
    { name: 'Sat', value: stats.unreadMessages },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const applicationsRes = await api.get("/student/applications");

        const chatRes = await api.get("/student/chats");

        // Calculate unread messages
        let unreadCount = 0;
        chatRes.data.forEach((chat) => {
          chat.messages.forEach((message) => {
            if (!message.read && message.sender !== user._id) {
              unreadCount++;
            }
          });
        });

        // Calculate applications stats
        const applications = applicationsRes.data;
        const activeApps = applications.filter(
          (app) =>
            app.status === "Accepted" && app.opportunityType === "Project"
        );

        const completedApps = applications.filter((app) => {
          if (app.opportunityType !== "Project") return false;
          const project = app.opportunity;
          return project && project.status === "Completed";
        });

        setStats({
          applications: applications.length,
          activeProjects: activeApps.length,
          completedProjects: completedApps.length,
          unreadMessages: unreadCount,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  const statBlocks = [
    {
      title: "Total Applications",
      value: stats.applications,
      icon: FaProjectDiagram,
      gradient: "from-[#123458] to-[#1e4a73]",
      link: "/student/applications",
      change: stats.applications > 10 ? `${Math.round((stats.applications / 20) * 100)}%` : "New",
      changeType: "increase",
      chartData: applicationsData,
      strokeColor: "#D4C9BE"
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      icon: FaProjectDiagram,
      gradient: "from-[#B8C8D9] to-[#9ab4cc]",
      link: "/student/projects",
      change: stats.activeProjects > 0 ? `${Math.round((stats.activeProjects / (stats.activeProjects + stats.completedProjects || 1)) * 100)}%` : "0%",
      changeType: stats.activeProjects > stats.completedProjects ? "increase" : "neutral",
      chartData: projectsData,
      strokeColor: "#123458"
    },
    {
      title: "Completed Projects",
      value: stats.completedProjects,
      icon: FaProjectDiagram,
      gradient: "from-[#D4C9BE] to-[#c9bcb0]",
      link: "/student/projects/approved",
      change: stats.completedProjects > 0 ? `${Math.round((stats.completedProjects / (stats.activeProjects + stats.completedProjects || 1)) * 100)}%` : "0%",
      changeType: stats.completedProjects > 0 ? "increase" : "neutral",
      chartData: completedProjectsData,
      strokeColor: "#123458"
    },
    {
      title: "Unread Messages",
      value: stats.unreadMessages,
      icon: FaEnvelope,
      gradient: "from-[#123458] via-[#1e4a73] to-[#B8C8D9]",
      link: "/student/chats",
      change: stats.unreadMessages > 5 ? "High" : stats.unreadMessages > 0 ? "Active" : "Clear",
      changeType: stats.unreadMessages > 5 ? "increase" : stats.unreadMessages > 0 ? "neutral" : "decrease",
      chartData: messagesData,
      strokeColor: "#D4C9BE"
    },
  ];

  const renderLineChart = (block) => {
    if (!block.chartData || block.chartData.length === 0) return null;
    
    return (
      <div className="h-16 w-full mt-4">
        <div className="w-full h-full flex items-end justify-between space-x-1">
          {block.chartData.map((point, index) => (
            <div
              key={index}
              className="bg-gradient-to-t rounded-t-sm transition-all duration-300 hover:opacity-80"
              style={{ 
                height: `${Math.max((point.value / Math.max(...block.chartData.map(d => d.value))) * 100, 5)}%`,
                backgroundColor: block.strokeColor,
                minWidth: '8px',
                flex: 1
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#123458' }}>
          Welcome to Your Dashboard
        </h1>
        <p className="text-lg" style={{ color: '#B8C8D9' }}>
          Manage your academic journey and connect with opportunities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statBlocks.map((block, index) => {
          const IconComponent = block.icon;
          return (
            <Link
              key={index}
              to={block.link}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${block.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative p-6 text-white">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                    <IconComponent className="text-2xl" />
                  </div>
                  <div className="text-right">
                    <div className={`text-sm px-2 py-1 rounded-full ${
                      block.changeType === 'increase' 
                        ? 'bg-green-500/20 text-green-200' 
                        : block.changeType === 'decrease'
                        ? 'bg-red-500/20 text-red-200'
                        : 'bg-blue-500/20 text-blue-200'
                    }`}>
                      {block.change}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="mb-4">
                  <div className="text-3xl font-bold mb-1">{block.value}</div>
                  <div className="text-white/80 text-sm font-medium">{block.title}</div>
                </div>

                {/* Mini Chart */}
                <div className="mt-4">
                  {renderLineChart(block)}
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 py-6 border-b" style={{ backgroundColor: '#f8fafc', borderBottomColor: '#B8C8D9' }}>
          <h2 className="text-2xl font-bold flex items-center" style={{ color: '#123458' }}>
            <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center" style={{ backgroundColor: '#D4C9BE' }}>
              <FaBell style={{ color: '#123458' }} />
            </div>
            Recent Activities
          </h2>
        </div>
        <div className="p-8">
          <RecentActivities user={user} />
        </div>
      </div>

      {/* Project Recommendations */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 py-6 border-b" style={{ backgroundColor: '#f8fafc', borderBottomColor: '#B8C8D9' }}>
          <h2 className="text-2xl font-bold flex items-center" style={{ color: '#123458' }}>
            <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center" style={{ backgroundColor: '#D4C9BE' }}>
              <FaProjectDiagram style={{ color: '#123458' }} />
            </div>
            Recommended Projects
          </h2>
        </div>
        <div className="p-8">
          <ProjectRecommendations user={user} />
        </div>
      </div>
    </div>
  );
};

// Recent Activities Component
const RecentActivities = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");

        // Get notifications as activities
        const notificationsRes = await api.get("/student/notifications");

        setActivities(notificationsRes.data.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchActivities();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#123458' }}></div>
        <p className="ml-3" style={{ color: '#B8C8D9' }}>Loading activities...</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f4f7fa' }}>
          <FaBell className="text-2xl" style={{ color: '#B8C8D9' }} />
        </div>
        <p style={{ color: '#B8C8D9' }}>No recent activities found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div
          key={activity._id}
          className="flex items-start p-4 rounded-xl hover:shadow-md transition-all duration-300"
          style={{ backgroundColor: index % 2 === 0 ? '#f4f7fa' : 'transparent' }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0" style={{ backgroundColor: '#D4C9BE' }}>
            <FaBell style={{ color: '#123458' }} />
          </div>
          <div className="flex-1">
            <p className="font-semibold mb-1" style={{ color: '#123458' }}>{activity.title}</p>
            <p className="mb-2" style={{ color: '#6b7280' }}>{activity.message}</p>
            <p className="text-sm" style={{ color: '#B8C8D9' }}>
              {new Date(activity.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Project Recommendations Component
const ProjectRecommendations = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (!user) return;

        const token = localStorage.getItem("token");

        // Get student skills
        const studentRes = await api.get(`/user/profile`);

        const skills = studentRes.data.skills || [];

        // Get projects with matching skills
        const projectsRes = await api.get("/student/projects", {
          params: { skills: skills.join(",") },
        });

        setProjects(projectsRes.data.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#123458' }}></div>
        <p className="ml-3" style={{ color: '#B8C8D9' }}>Loading recommendations...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f4f7fa' }}>
          <FaProjectDiagram className="text-2xl" style={{ color: '#B8C8D9' }} />
        </div>
        <p style={{ color: '#B8C8D9' }}>
          No project recommendations found. Update your skills to get matched with projects.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((project, index) => (
        <div
          key={project._id}
          className="p-6 rounded-xl border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          style={{ 
            backgroundColor: index % 2 === 0 ? '#f4f7fa' : 'white',
            borderColor: '#B8C8D9'
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-bold text-xl" style={{ color: '#123458' }}>{project.title}</h3>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D4C9BE' }}>
              <FaProjectDiagram style={{ color: '#123458' }} />
            </div>
          </div>
          
          <p className="mb-4 leading-relaxed" style={{ color: '#6b7280' }}>
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.skills.map((skill, skillIndex) => (
              <span
                key={skillIndex}
                className="px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                style={{ 
                  backgroundColor: '#D4C9BE', 
                  color: '#123458' 
                }}
              >
                {skill}
              </span>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: '#B8C8D9' }}>
                <FaUser style={{ color: '#123458' }} />
              </div>
              <span className="text-sm font-medium" style={{ color: '#6b7280' }}>
                {project.alumni ? project.alumni.name : "Alumni"}
              </span>
            </div>
            <Link
              to={`/student/projects/${project._id}`}
              className="px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              style={{ 
                backgroundColor: '#123458', 
                color: 'white' 
              }}
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
      
      <div className="text-center mt-8">
        <Link
          to="/student/projects"
          className="inline-flex items-center px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          style={{ 
            backgroundColor: '#D4C9BE', 
            color: '#123458' 
          }}
        >
          <FaProjectDiagram className="mr-2" />
          View All Projects
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;



























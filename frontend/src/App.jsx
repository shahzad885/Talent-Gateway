// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import Signup from "./pages/Signup";
// import Login from "./pages/Login";
// import AdminDashboard from "./pages/AdminDashboard";
// import StudentDashboard from "./pages/StudentDashboard";
// import AlumniDashboard from "./pages/AlumniDashboard";
// import PrivateRoute from "./routes/PrivateRoute";
// // Import the new components
// import CreateProject from "./pages/alumni/CreateProject";
// import CreateInternship from "./pages/alumni/CreateInternship";
// import ProjectDetailPage from "./pages/alumni/ProjectDetailPage";
// import InternshipDetailPage from "./pages/alumni/InternshipDetailPage";

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/" element={<RoleBasedRedirect />} />
//           <Route
//             path="/admin"
//             element={<PrivateRoute role="admin" Component={AdminDashboard} />}
//           />
//           <Route
//             path="/student/*"
//             element={
//               <PrivateRoute role="student" Component={StudentDashboard} />
//             }
//           />
//           <Route
//             path="/alumni"
//             element={<PrivateRoute role="alumni" Component={AlumniDashboard} />}
//           />
//           {/* New routes for project and internship creation */}
//           <Route
//             path="/alumni/projects/new"
//             element={<PrivateRoute role="alumni" Component={CreateProject} />}
//           />
//           <Route path="/alumni/projects/:id" element={<ProjectDetailPage />} />
//           <Route
//             path="/alumni/internships/:id"
//             element={<InternshipDetailPage />}
//           />
//           <Route
//             path="/alumni/internships/new"
//             element={
//               <PrivateRoute role="alumni" Component={CreateInternship} />
//             }
//           />
//           <Route path="*" element={<Navigate to="/login" />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// // New component to handle role-based redirection
// function RoleBasedRedirect() {
//   const { user, loading } = useAuth();

//   // If still loading auth state, you could show a loading spinner
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // If not logged in, redirect to login
//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   // Redirect based on role
//   switch (user.role) {
//     case "admin":
//       return <Navigate to="/admin" />;
//     case "student":
//       return <Navigate to="/student" />;
//     case "alumni":
//       return <Navigate to="/alumni" />;
//     default:
//       return <Navigate to="/login" />;
//   }
// }
// export default App;

import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AlumniDashboard from "./pages/AlumniDashboard";
import PrivateRoute from "./routes/PrivateRoute";
import CreateProject from "./pages/alumni/CreateProject";
import CreateInternship from "./pages/alumni/CreateInternship";
import ProjectDetailPage from "./pages/alumni/ProjectDetailPage";
import InternshipDetailPage from "./pages/alumni/InternshipDetailPage";
import VideoCall from "./components/student/VideoCall";


// Mock Link component for demonstration
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-[#123458] to-[#B8C8D9] px-8 py-5 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-[#D4C9BE] rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-[#123458] rounded-sm transform rotate-45"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-[#123458]"></div>
            </div>
            <span className="text-3xl font-extrabold text-white tracking-wide">TalentGateWay</span>
          </div>
          <div className="flex items-center space-x-8">
            <Link
              to="/login"
              className="flex items-center text-[#D4C9BE] hover:text-white transition-all duration-300 font-medium text-lg"
            >
              <div className="w-6 h-6 mr-2 bg-[#D4C9BE] rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-[#123458] rounded-full"></div>
              </div>
              Access Portal
            </Link>
            <Link
              to="/signup"
              className="bg-[#D4C9BE] hover:bg-white text-[#123458] font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Join Network
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#f4f7fa] via-white to-[#B8C8D9] py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#123458]/10 to-[#B8C8D9]/20"></div>
        <div className="container mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl font-black text-[#123458] leading-tight">
                  Bridge Your
                  <span className="block text-[#B8C8D9]">Academic Journey</span>
                </h1>
                <p className="text-xl text-[#123458]/80 leading-relaxed max-w-lg">
                  Unite with mentors, discover opportunities, and build lasting connections that shape your professional future.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  to="/signup"
                  className="bg-[#123458] text-white hover:bg-[#B8C8D9] hover:text-[#123458] font-bold py-4 px-10 rounded-full transition-all duration-300 text-center shadow-2xl hover:shadow-3xl transform hover:scale-105"
                >
                  Start Journey
                </Link>
                <Link
                  to="/login"
                  className="border-3 border-[#123458] text-[#123458] hover:bg-[#123458] hover:text-white font-bold py-4 px-10 rounded-full transition-all duration-300 text-center"
                >
                  Explore More
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-[#D4C9BE] to-[#B8C8D9] rounded-3xl shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-500">
                  <div className="absolute inset-4 bg-white rounded-2xl flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="w-12 h-12 bg-[#123458] rounded-full opacity-80"></div>
                      <div className="w-12 h-12 bg-[#B8C8D9] rounded-full opacity-60"></div>
                      <div className="w-12 h-12 bg-[#D4C9BE] rounded-full opacity-70"></div>
                      <div className="w-12 h-12 bg-[#123458] rounded-full opacity-50"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-[#123458] mb-6">
              Unlock Your Potential
            </h2>
            <div className="w-24 h-1 bg-[#B8C8D9] mx-auto rounded-full"></div>
          </div>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-[#f4f7fa] to-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#B8C8D9] to-[#D4C9BE] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-[#123458]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#123458] mb-4">Expand Networks</h3>
              <p className="text-[#123458]/70 leading-relaxed">
                Build powerful connections with industry leaders and peers who share your academic background and professional aspirations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-[#f4f7fa] to-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#D4C9BE] to-[#B8C8D9] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-[#123458]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#123458] mb-4">Open Doors</h3>
              <p className="text-[#123458]/70 leading-relaxed">
                Discover hidden opportunities through exclusive internship programs and collaborative projects with established professionals.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-[#f4f7fa] to-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#123458] to-[#B8C8D9] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#123458] mb-4">Wisdom Exchange</h3>
              <p className="text-[#123458]/70 leading-relaxed">
                Tap into a wealth of experience through mentorship programs and gain valuable insights from successful alumni.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 bg-gradient-to-br from-[#f4f7fa] to-[#B8C8D9]/20">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-[#123458] mb-6">
              Transformation Stories
            </h2>
            <div className="w-24 h-1 bg-[#D4C9BE] mx-auto rounded-full"></div>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Story 1 */}
            <div className="bg-white p-12 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-l-8 border-[#B8C8D9]">
              <div className="flex items-start space-x-6 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#D4C9BE] to-[#B8C8D9] rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-[#123458] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">S</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#123458] rounded-full border-4 border-white"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#123458] mb-2">Sarah Chen</h3>
                  <p className="text-[#B8C8D9] font-semibold">Graduate 2020 • Tech Innovator</p>
                </div>
              </div>
              <blockquote className="text-[#123458]/80 text-lg italic leading-relaxed">
                "This platform became my career catalyst. The connections I made here opened doors I never knew existed and guided me to my current role at a leading tech company."
              </blockquote>
            </div>

            {/* Story 2 */}
            <div className="bg-white p-12 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-l-8 border-[#D4C9BE]">
              <div className="flex items-start space-x-6 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#123458] to-[#B8C8D9] rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <span className="text-[#123458] font-bold text-xl">M</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#D4C9BE] rounded-full border-4 border-white"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#123458] mb-2">Marcus Thompson</h3>
                  <p className="text-[#B8C8D9] font-semibold">Graduate 2018 • Business Leader</p>
                </div>
              </div>
              <blockquote className="text-[#123458]/80 text-lg italic leading-relaxed">
                "Being able to mentor and hire from my alma mater creates a beautiful cycle of growth. Watching students flourish through these connections is incredibly rewarding."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#123458] via-[#B8C8D9] to-[#123458] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl font-black text-white mb-8 leading-tight">
              Your Network Awaits
            </h2>
            <p className="text-2xl text-white/90 mb-12 leading-relaxed">
              Step into a community where connections create opportunities and relationships build futures.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-8">
              <Link
                to="/signup"
                className="bg-white text-[#123458] hover:bg-[#D4C9BE] hover:text-[#123458] font-bold py-5 px-12 rounded-full transition-all duration-300 text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105"
              >
                Begin Networking
              </Link>
              <Link
                to="/login"
                className="border-3 border-white text-white hover:bg-white hover:text-[#123458] font-bold py-5 px-12 rounded-full transition-all duration-300 text-xl"
              >
                Member Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#123458] text-white py-20">
        <div className="container mx-auto px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#D4C9BE] rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-[#123458] rounded-sm transform rotate-45"></div>
                </div>
                <span className="text-2xl font-extrabold tracking-wide">TalentGateway</span>
              </div>
              <p className="text-[#B8C8D9] leading-relaxed">
                Creating bridges between academic excellence and professional success through meaningful connections.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6 text-[#D4C9BE]">Navigation</h4>
              <ul className="space-y-4">
                <li><Link to="/" className="text-white/80 hover:text-[#D4C9BE] transition-colors">Home</Link></li>
                <li><Link to="/login" className="text-white/80 hover:text-[#D4C9BE] transition-colors">Portal Access</Link></li>
                <li><Link to="/signup" className="text-white/80 hover:text-[#D4C9BE] transition-colors">Join Network</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6 text-[#D4C9BE]">Support</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-white/80 hover:text-[#D4C9BE] transition-colors">Help Center</a></li>
                <li><a href="#" className="text-white/80 hover:text-[#D4C9BE] transition-colors">Privacy</a></li>
                <li><a href="#" className="text-white/80 hover:text-[#D4C9BE] transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-6 text-[#D4C9BE]">Connect</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-white/80">
                  <div className="w-6 h-6 bg-[#B8C8D9] rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#123458] rounded-full"></div>
                  </div>
                  <span>hello@talentgateway.edu</span>
                </div>
                <div className="flex items-center space-x-3 text-white/80">
                  <div className="w-6 h-6 bg-[#D4C9BE] rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#123458] rounded-full"></div>
                  </div>
                  <span>456 Campus Drive, Education City</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-[#B8C8D9]/30 flex flex-col lg:flex-row justify-between items-center">
            <p className="text-white/60 mb-6 lg:mb-0">© 2025 TalentGateWay Network. All rights reserved.</p>
            {/* <div className="flex space-x-6">
              {[1, 2, 3, 4].map((i) => (
                <a key={i} href="#" className="w-10 h-10 bg-[#B8C8D9]/20 hover:bg-[#D4C9BE] rounded-full flex items-center justify-center transition-colors group">
                  <div className="w-5 h-5 bg-white/60 group-hover:bg-[#123458] rounded-full"></div>
                </a>
              ))}
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
};



// RoleBasedRedirect component (included from original code)
function RoleBasedRedirect() {
  const { user, loading } = useAuth();

  // If still loading auth state, you could show a loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect based on role
  switch (user.role) {
    case "admin":
      return <Navigate to="/admin" />;
    case "student":
      return <Navigate to="/student" />;
    case "alumni":
      return <Navigate to="/alumni" />;
    default:
      return <Navigate to="/login" />;
  }
}

// Updated App component to include the Landing Page
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<RoleBasedRedirect />} />
          <Route
            path="/admin"
            element={<PrivateRoute role="admin" Component={AdminDashboard} />}
          />
          <Route path="/student/video-calls" element={<VideoCall />} />
          <Route
            path="/student/*"
            element={
              <PrivateRoute role="student" Component={StudentDashboard} />
            }
          />

          <Route
            path="/alumni"
            element={<PrivateRoute role="alumni" Component={AlumniDashboard} />}
          />
          {/* Routes for project and internship creation */}
          <Route
            path="/alumni/projects/new"
            element={<PrivateRoute role="alumni" Component={CreateProject} />}
          />
          <Route path="/alumni/projects/:id" element={<ProjectDetailPage />} />
          <Route
            path="/alumni/internships/:id"
            element={<InternshipDetailPage />}
          />
          <Route
            path="/alumni/internships/new"
            element={
              <PrivateRoute role="alumni" Component={CreateInternship} />
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

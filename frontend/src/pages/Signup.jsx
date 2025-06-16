// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api"; // Import centralized Axios instance
// import { User, Mail, Lock, Phone, UserPlus, Users } from "lucide-react";
// import emailjs from "@emailjs/browser";

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     contactInfo: "",
//     role: "student",
//   });

//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Function to send welcome email
//   const sendWelcomeEmail = async (userData) => {
//     try {
//       const templateParams = {
//         to_name: userData.name,
//         to_email: userData.email,
//         user_role: userData.role,
//         message: `Welcome to our community! We're excited to have you join us as a ${userData.role}.`,
//       };

//       await emailjs.send(
//         "service_r4tovqs", // Your EmailJS service ID
//         "template_dvptzac", // You'll need to create this template in EmailJS
//         templateParams,
//         "qjQPUsReHylZO5Yla" // Your EmailJS public key
//       );

//       console.log("Welcome email sent successfully!");
//     } catch (error) {
//       console.error("Failed to send welcome email:", error);
//       // Don't throw error here - we don't want email failure to break signup
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     try {
//       // Create the account
//       const response = await api.post("/auth/signup", formData);

//       // Send welcome email after successful signup
//       await sendWelcomeEmail(formData);

//       // Navigate to login page
//       navigate("/login");
//     } catch (error) {
//       setError(error.response?.data?.message || "Signup failed");
//       console.error(
//         "Signup failed:",
//         error.response?.data?.message || error.message
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//         <div className="text-center">
//           <h2 className="text-3xl font-extrabold text-gray-900">
//             Create Account
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Sign up to join our community
//           </p>
//         </div>

//         {error && (
//           <div className="flex items-center p-4 text-sm text-red-800 rounded-lg bg-red-50">
//             <span>{error}</span>
//           </div>
//         )}

//         <form className="space-y-6" onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <div>
//               <label
//                 htmlFor="name"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Full Name
//               </label>
//               <div className="relative mt-1">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <User className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   required
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="block w-full pl-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   placeholder="John Doe"
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Email Address
//               </label>
//               <div className="relative mt-1">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <Mail className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="block w-full pl-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   placeholder="example@email.com"
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Password
//               </label>
//               <div className="relative mt-1">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <Lock className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="new-password"
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="block w-full pl-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   placeholder="••••••••"
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="contactInfo"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Contact Information
//               </label>
//               <div className="relative mt-1">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <Phone className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="contactInfo"
//                   name="contactInfo"
//                   type="text"
//                   required
//                   value={formData.contactInfo}
//                   onChange={handleChange}
//                   className="block w-full pl-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   placeholder="Phone or other contact details"
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="role"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Role
//               </label>
//               <div className="relative mt-1">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <Users className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <select
//                   id="role"
//                   name="role"
//                   value={formData.role}
//                   onChange={handleChange}
//                   className="block w-full pl-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   disabled={isLoading}
//                 >
//                   <option value="student">Student</option>
//                   <option value="alumni">Alumni</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <UserPlus className="w-5 h-5 mr-2" />
//               {isLoading ? "Creating Account..." : "Create Account"}
//             </button>
//           </div>

//           <div className="text-center text-sm">
//             <p className="text-gray-600">
//               Already have an account?{" "}
//               <a
//                 href="/login"
//                 className="font-medium text-blue-600 hover:text-blue-500"
//               >
//                 Log in
//               </a>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Import centralized Axios instance
import { User, Mail, Lock, Phone, UserPlus, Users, AlertCircle } from "lucide-react";
import emailjs from "@emailjs/browser";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactInfo: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to send welcome email
  const sendWelcomeEmail = async (userData) => {
    try {
      const templateParams = {
        to_name: userData.name,
        to_email: userData.email,
        user_role: userData.role,
        message: `Welcome to our community! We're excited to have you join us as a ${userData.role}.`,
      };

      await emailjs.send(
        "service_5hetqzw", // Your EmailJS service ID
        "template_0e6i201", // You'll need to create this template in EmailJS
        templateParams,
        "IpbgyNyXoZIJrHtaL" // Your EmailJS public key
      );

      console.log("Welcome email sent successfully!");
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      // Don't throw error here - we don't want email failure to break signup
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Create the account
      const response = await api.post("/auth/signup", formData);

      // Send welcome email after successful signup
      await sendWelcomeEmail(formData);

      // Navigate to login page
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
      console.error(
        "Signup failed:",
        error.response?.data?.message || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
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
          className="absolute top-1/4 right-1/3 w-24 h-24 rounded-full opacity-5 animate-bounce"
          style={{ backgroundColor: '#D4C9BE', animationDelay: '1s' }}
        ></div>
      </div>

      {/* Main signup container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header section */}
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg"
            style={{ backgroundColor: '#123458' }}
          >
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#123458' }}>
            Join Our Community
          </h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {/* Signup form card */}
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
              <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Contact Info field */}
            <div className="space-y-2">
              <label htmlFor="contactInfo" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                Contact Information
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  id="contactInfo"
                  name="contactInfo"
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
                  placeholder="Phone or contact details"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Role field */}
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-semibold" style={{ color: '#123458' }}>
                Role
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Users className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 bg-white/50 appearance-none hover:bg-white/70 focus:bg-white/80"
                  style={{
                    color: '#123458'
                  }}
                  disabled={isLoading}
                >
                  <option value="student" style={{ color: '#123458', backgroundColor: '#f4f7fa', padding: '8px 12px' }}>Student</option>
                  <option value="alumni" style={{ color: '#123458', backgroundColor: '#f4f7fa', padding: '8px 12px' }}>Alumni</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 transition-colors group-focus-within:text-blue-500" style={{ color: '#B8C8D9' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Create Account button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ 
                backgroundColor:' #123458',
                boxShadow: '0 10px 30px -5px rgba(18, 52, 88, 0.3)'
              }}
            >
              <UserPlus className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span 
                  className="px-4 bg-white/80 text-gray-500 font-medium"
                >
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login link */}
            <div className="text-center">
              <a
                href="/login"
                className="inline-flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-md hover:scale-105"
                style={{ 
                  backgroundColor: '#B8C8D9',
                  color: '#123458'
                }}
              >
                Sign In Instead
              </a>
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

export default Signup;
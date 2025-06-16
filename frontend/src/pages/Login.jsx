// // import { useState, useEffect } from "react";
// // import { useAuth } from "../context/AuthContext";
// // import { useNavigate } from "react-router-dom";
// // import { Mail, Lock, AlertCircle, LogIn } from "lucide-react";

// // const Login = () => {
// //   const [formData, setFormData] = useState({ email: "", password: "" });
// //   const [error, setError] = useState("");
// //   const { login, user } = useAuth();
// //   const navigate = useNavigate();

// //   // Use effect to navigate when user changes
// //   useEffect(() => {
// //     if (user) {
// //       switch (user.role) {
// //         case "admin":
// //           navigate("/admin");
// //           break;
// //         case "student":
// //           navigate("/student");
// //           break;
// //         case "alumni":
// //           navigate("/alumni");
// //           break;
// //         default:
// //           // If no recognized role, stay on login
// //           break;
// //       }
// //     }
// //   }, [user, navigate]);

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     try {
// //       await login(formData.email, formData.password);
// //       // Navigation will be handled by the useEffect
// //     } catch (error) {
// //       setError(error.response?.data?.message || "Login failed");
// //       console.error(
// //         "Login failed:",
// //         error.response?.data?.message || error.message
// //       );
// //     }
// //   };

// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
// //       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
// //         <div className="text-center">
// //           <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Login</h2>
// //         </div>

// //         {error && (
// //           <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
// //             <AlertCircle className="w-5 h-5 mr-2" />
// //             <span>{error}</span>
// //           </div>
// //         )}

// //         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
// //           <div className="space-y-4 rounded-md shadow-sm">
// //             <div>
// //               <label htmlFor="email" className="sr-only">
// //                 Email address
// //               </label>
// //               <div className="relative">
// //                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
// //                   <Mail className="w-5 h-5 text-gray-400" />
// //                 </div>
// //                 <input
// //                   id="email"
// //                   name="email"
// //                   type="email"
// //                   autoComplete="email"
// //                   required
// //                   className="block w-full pl-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// //                   placeholder="Email address"
// //                   value={formData.email}
// //                   onChange={handleChange}
// //                 />
// //               </div>
// //             </div>

// //             <div>
// //               <label htmlFor="password" className="sr-only">
// //                 Password
// //               </label>
// //               <div className="relative">
// //                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
// //                   <Lock className="w-5 h-5 text-gray-400" />
// //                 </div>
// //                 <input
// //                   id="password"
// //                   name="password"
// //                   type="password"
// //                   autoComplete="current-password"
// //                   required
// //                   className="block w-full pl-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// //                   placeholder="Password"
// //                   value={formData.password}
// //                   onChange={handleChange}
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           <div>
// //             <button
// //               type="submit"
// //               className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
// //             >
// //               <LogIn className="w-5 h-5 mr-2" />
// //               Login
// //             </button>
// //             <div className="text-center text-sm mt-2">
// //               <p className="text-gray-600">
// //                 Dont have an account?{" "}
// //                 <a
// //                   href="/signup"
// //                   className="font-medium text-blue-600 hover:text-blue-500"
// //                 >
// //                   Sign Up
// //                 </a>
// //               </p>
// //             </div>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;


















// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { Mail, Lock, AlertCircle, LogIn, User } from "lucide-react";

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError("");
//   try {
//     await login(formData.email, formData.password);
//     // Navigation will be handled by the useEffect
//   } catch (error) {
//     setError(error.response?.data?.message || "Login failed");
//   }
// };

//   return (
//     <div 
//       className="min-h-screen flex items-center justify-center relative overflow-hidden"
//       style={{ backgroundColor: '#f4f7fa' }}
//     >
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div 
//           className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10 animate-pulse"
//           style={{ backgroundColor: '#B8C8D9' }}
//         ></div>
//         <div 
//           className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10 animate-pulse"
//           style={{ backgroundColor: '#D4C9BE' }}
//         ></div>
//         <div 
//           className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full opacity-5 animate-bounce"
//           style={{ backgroundColor: '#123458' }}
//         ></div>
//       </div>

//       {/* Main login container */}
//       <div className="relative z-10 w-full max-w-md">
//         {/* Header section */}
//         <div className="text-center mb-8">
//           <div 
//             className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg"
//             style={{ backgroundColor: '#123458' }}
//           >
//             <User className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-4xl font-bold mb-2" style={{ color: '#123458' }}>
//             Welcome Back
//           </h1>
//           <p className="text-gray-600">Please sign in to your account</p>
//         </div>

//         {/* Login form card */}
//         <div 
//           className="backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl p-8 border border-white/20"
//           style={{ 
//             boxShadow: '0 25px 50px -12px rgba(18, 52, 88, 0.15)',
//           }}
//         >
//           {error && (
//             <div 
//               className="flex items-center p-4 mb-6 rounded-2xl"
//               style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
//             >
//               <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
//               <span className="text-red-700 text-sm font-medium">{error}</span>
//             </div>
//           )}

//           <div onSubmit={handleSubmit} className="space-y-6">
//             {/* Email field */}
//             <div className="space-y-2">
//               <label htmlFor="email" className="block text-sm font-semibold" style={{ color: '#123458' }}>
//                 Email Address
//               </label>
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//                   <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             {/* Password field */}
//             <div className="space-y-2">
//               <label htmlFor="password" className="block text-sm font-semibold" style={{ color: '#123458' }}>
//                 Password
//               </label>
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//                   <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
//                   placeholder="Enter your password"
//                   value={formData.password}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             {/* Login button */}
//             <button
//               type="submit"
//               onClick={handleSubmit}
//               className="w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center group"
//               style={{ 
//                 backgroundColor: '#123458',
//                 boxShadow: '0 10px 30px -5px rgba(18, 52, 88, 0.3)'
//               }}
//             >
//               <LogIn className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
//               Login
//             </button>

//             {/* Divider */}
//             <div className="relative my-8">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span 
//                   className="px-4 bg-white/80 text-gray-500 font-medium"
//                 >
//                   New to our platform?
//                 </span>
//               </div>
//             </div>

//             {/* Sign up link */}
//             <div className="text-center">
//               <p className="text-gray-600 mb-4">
//                 Don't have an account?{" "}
//                 <button
//                   onClick={() => console.log("Navigate to /signup")}
//                   className="font-semibold hover:underline transition-all duration-200 cursor-pointer"
//                   style={{ color: '#123458' }}
//                 >
//                   Sign Up
//                 </button>
//               </p>
//               <button
//                 onClick={() => console.log("Navigate to /signup")}
//                 className="inline-flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-md hover:scale-105"
//                 style={{ 
//                   backgroundColor: '#B8C8D9',
//                   color: '#123458'
//                 }}
//               >
//                 Create New Account
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-8">
//           <p className="text-sm text-gray-500">
//             © 2024 Your Platform. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// // import { useState } from "react";
// // import { Mail, Lock, AlertCircle, LogIn, User } from "lucide-react";

// // const Login = () => {
// //   const [formData, setFormData] = useState({ email: "", password: "" });
// //   const [error, setError] = useState("");

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     setError("");
// //     // Your original login logic would go here
// //     console.log("Login attempt with:", formData);
// //   };

// //   return (
// //     <div 
// //       className="min-h-screen flex items-center justify-center relative overflow-hidden"
// //       style={{ backgroundColor: '#f4f7fa' }}
// //     >
// //       {/* Animated background elements */}
// //       <div className="absolute inset-0 overflow-hidden">
// //         <div 
// //           className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10 animate-pulse"
// //           style={{ backgroundColor: '#B8C8D9' }}
// //         ></div>
// //         <div 
// //           className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10 animate-pulse"
// //           style={{ backgroundColor: '#D4C9BE' }}
// //         ></div>
// //         <div 
// //           className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full opacity-5 animate-bounce"
// //           style={{ backgroundColor: '#123458' }}
// //         ></div>
// //       </div>

// //       {/* Main login container */}
// //       <div className="relative z-10 w-full max-w-md">
// //         {/* Header section */}
// //         <div className="text-center mb-8">
// //           <div 
// //             className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg"
// //             style={{ backgroundColor: '#123458' }}
// //           >
// //             <User className="w-10 h-10 text-white" />
// //           </div>
// //           <h1 className="text-4xl font-bold mb-2" style={{ color: '#123458' }}>
// //             Welcome Back
// //           </h1>
// //           <p className="text-gray-600">Please sign in to your account</p>
// //         </div>

// //         {/* Login card */}
// //         <div 
// //           className="backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl p-8 border border-white/20"
// //           style={{ 
// //             boxShadow: '0 25px 50px -12px rgba(18, 52, 88, 0.15)',
// //           }}
// //         >
// //           {error && (
// //             <div 
// //               className="flex items-center p-4 mb-6 rounded-2xl"
// //               style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
// //             >
// //               <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
// //               <span className="text-red-700 text-sm font-medium">{error}</span>
// //             </div>
// //           )}

// //           <div className="space-y-6">
// //             {/* Email field */}
// //             <div className="space-y-2">
// //               <label htmlFor="email" className="block text-sm font-semibold" style={{ color: '#123458' }}>
// //                 Email Address
// //               </label>
// //               <div className="relative group">
// //                 <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
// //                   <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
// //                 </div>
// //                 <input
// //                   id="email"
// //                   name="email"
// //                   type="email"
// //                   autoComplete="email"
// //                   required
// //                   className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
// //                   placeholder="Enter your email"
// //                   value={formData.email}
// //                   onChange={handleChange}
// //                 />
// //               </div>
// //             </div>

// //             {/* Password field */}
// //             <div className="space-y-2">
// //               <label htmlFor="password" className="block text-sm font-semibold" style={{ color: '#123458' }}>
// //                 Password
// //               </label>
// //               <div className="relative group">
// //                 <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
// //                   <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
// //                 </div>
// //                 <input
// //                   id="password"
// //                   name="password"
// //                   type="password"
// //                   autoComplete="current-password"
// //                   required
// //                   className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
// //                   placeholder="Enter your password"
// //                   value={formData.password}
// //                   onChange={handleChange}
// //                 />
// //               </div>
// //             </div>

// //             {/* Login button */}
// //             <button
// //               type="submit"
// //               onClick={handleSubmit}
// //               className="w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center group"
// //               style={{ 
// //                 backgroundColor: '#123458',
// //                 boxShadow: '0 10px 30px -5px rgba(18, 52, 88, 0.3)'
// //               }}
// //             >
// //               <LogIn className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
// //               Sign In
// //             </button>

// //             {/* Divider */}
// //             <div className="relative my-8">
// //               <div className="absolute inset-0 flex items-center">
// //                 <div className="w-full border-t border-gray-300"></div>
// //               </div>
// //               <div className="relative flex justify-center text-sm">
// //                 <span 
// //                   className="px-4 bg-white/80 text-gray-500 font-medium"
// //                 >
// //                   New to our platform?
// //                 </span>
// //               </div>
// //             </div>

// //             {/* Sign up link */}
// //             <div className="text-center">
// //               <button
// //                 onClick={() => console.log("Navigate to signup")}
// //                 className="inline-flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-md"
// //                 style={{ 
// //                   backgroundColor: '#B8C8D9',
// //                   color: '#123458'
// //                 }}
// //               >
// //                 Create New Account
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Footer */}
// //         <div className="text-center mt-8">
// //           <p className="text-sm text-gray-500">
// //             © 2024 Your Platform. All rights reserved.
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle, LogIn, User } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Use effect to navigate when user changes
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "student":
          navigate("/student");
          break;
        case "alumni":
          navigate("/alumni");
          break;
        default:
          // If no recognized role, stay on login
          break;
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(formData.email, formData.password);
      // Navigation will be handled by the useEffect
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
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
      </div>

      {/* Main login container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header section */}
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 shadow-lg"
            style={{ backgroundColor: '#123458' }}
          >
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#123458' }}>
            Welcome Back
          </h1>
          <p className="text-gray-600">Please sign in to your account</p>
        </div>

        {/* Login form card */}
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

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  autoComplete="current-password"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/50"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center group"
              style={{ 
                backgroundColor: '#123458',
                boxShadow: '0 10px 30px -5px rgba(18, 52, 88, 0.3)'
              }}
            >
              <LogIn className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
              Login
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
                  New to our platform?
                </span>
              </div>
            </div>

            {/* Sign up link */}
            <div className="text-center">
              {/* <p className="text-gray-600 mb-4">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="font-semibold hover:underline transition-all duration-200"
                  style={{ color: '#123458' }}
                >
                  Sign Up
                </a>
              </p> */}
              <a
                href="/signup"
                className="inline-flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-md hover:scale-105"
                style={{ 
                  backgroundColor: '#B8C8D9',
                  color: '#123458'
                }}
              >
                Create New Account
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

export default Login;
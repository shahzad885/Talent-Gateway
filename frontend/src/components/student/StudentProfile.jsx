// import React, { useState, useEffect, useRef } from "react";
// import api from "../../services/api";
// import { FaUser, FaEdit, FaSave, FaCamera, FaTrash } from "react-icons/fa";

// const StudentProfile = ({ user }) => {
//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//     bio: "",
//     university: "",
//     graduationYear: "",
//     degree: "",
//     major: "",
//     skills: [],
//     resumeUrl: "",
//     linkedinUrl: "",
//     githubUrl: "",
//     phoneNumber: "",
//     profileImageURL: "https://avatar.iran.liara.run/public",
//   });

//   const [editMode, setEditMode] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [newSkill, setNewSkill] = useState("");
//   const [saveStatus, setSaveStatus] = useState("");
//   const [imageUploading, setImageUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   // Sync profile state with user prop when it changes
//   useEffect(() => {
//     if (user) {
//       setProfile({
//         name: user.name || "",
//         email: user.email || "",
//         bio: user.bio || "",
//         university: user.university || "",
//         graduationYear: user.graduationYear || "",
//         degree: user.degree || "",
//         major: user.major || "",
//         skills: user.skills || [],
//         resumeUrl: user.resumeUrl || "",
//         linkedinUrl: user.linkedinUrl || "",
//         githubUrl: user.githubUrl || "",
//         phoneNumber: user.phoneNumber || "",
//         profileImageURL:
//           user.profileImageURL || "https://avatar.iran.liara.run/public",
//       });
//       setLoading(false);
//     } else {
//       setLoading(true);
//     }
//   }, [user]);
//   const getImageUrl = (imageUrl) => {
//     if (!imageUrl) {
//       return "https://avatar.iran.liara.run/public";
//     }

//     // If it's already a full URL (https or external), return as is
//     if (
//       imageUrl.startsWith("https://") ||
//       imageUrl.startsWith("http://avatar.iran.liara.run")
//     ) {
//       return imageUrl;
//     }

//     // If it's a relative path starting with /uploads, it will be proxied automatically
//     if (imageUrl.startsWith("/uploads/")) {
//       return imageUrl; // Vite proxy will handle this
//     }

//     // If it's an old full HTTP URL, convert to relative path
//     if (imageUrl.startsWith("http://192.168.100.16:5000/")) {
//       return imageUrl.replace("http://192.168.100.16:5000", "");
//     }

//     return imageUrl;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfile((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleAddSkill = () => {
//     if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
//       setProfile((prev) => ({
//         ...prev,
//         skills: [...prev.skills, newSkill.trim()],
//       }));
//       setNewSkill("");
//     }
//   };

//   const handleRemoveSkill = (skillToRemove) => {
//     setProfile((prev) => ({
//       ...prev,
//       skills: prev.skills.filter((skill) => skill !== skillToRemove),
//     }));
//   };

//   const handleImageUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     // Validate file type
//     const allowedTypes = [
//       "image/jpeg",
//       "image/jpg",
//       "image/png",
//       "image/gif",
//       "image/webp",
//     ];
//     if (!allowedTypes.includes(file.type)) {
//       setSaveStatus(
//         "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
//       );
//       return;
//     }

//     // Validate file size (5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       setSaveStatus("Image size should be less than 5MB");
//       return;
//     }

//     setImageUploading(true);
//     setSaveStatus("Uploading image...");

//     try {
//       const formData = new FormData();
//       formData.append("profileImage", file);

//       const response = await api.post("/user/upload-profile-image", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       // Update profile state with new image URL
//       setProfile((prev) => ({
//         ...prev,
//         profileImageURL: response.data.profileImageURL,
//       }));

//       setSaveStatus("Profile image updated successfully!");
//       setTimeout(() => setSaveStatus(""), 3000);
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       setSaveStatus(
//         error.response?.data?.message ||
//           "Error uploading image. Please try again."
//       );
//     } finally {
//       setImageUploading(false);
//     }
//   };

//   const handleDeleteImage = async () => {
//     if (window.confirm("Are you sure you want to delete your profile image?")) {
//       setImageUploading(true);
//       setSaveStatus("Deleting image...");

//       try {
//         const response = await api.delete("/user/delete-profile-image");

//         // Update profile state with default image
//         setProfile((prev) => ({
//           ...prev,
//           profileImageURL: response.data.profileImageURL,
//         }));

//         setSaveStatus("Profile image deleted successfully!");
//         setTimeout(() => setSaveStatus(""), 3000);
//       } catch (error) {
//         console.error("Error deleting image:", error);
//         setSaveStatus("Error deleting image. Please try again.");
//       } finally {
//         setImageUploading(false);
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaveStatus("Saving...");

//     try {
//       const response = await api.put("/student/profile", profile);
//       setSaveStatus("Profile updated successfully!");
//       setEditMode(false);
//       setTimeout(() => setSaveStatus(""), 3000);
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       setSaveStatus("Error updating profile. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-gray-500">Loading profile...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md">
//       <div className="border-b px-6 py-4 flex justify-between items-center">
//         <h1 className="text-2xl font-bold">My Profile</h1>
//         <button
//           onClick={() => setEditMode(!editMode)}
//           className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//         >
//           {editMode ? (
//             <>
//               <FaUser className="mr-2" /> View Profile
//             </>
//           ) : (
//             <>
//               <FaEdit className="mr-2" /> Edit Profile
//             </>
//           )}
//         </button>
//       </div>

//       <div className="p-6">
//         {saveStatus && (
//           <div
//             className={`mb-4 p-3 rounded ${
//               saveStatus.includes("Error")
//                 ? "bg-red-100 text-red-700"
//                 : "bg-green-100 text-green-700"
//             }`}
//           >
//             {saveStatus}
//           </div>
//         )}

//         {/* Profile Image Section */}
//         <div className="flex flex-col items-center mb-6">
//           <div className="relative">
//             <img
//               src={getImageUrl(profile.profileImageURL)}
//               alt="Profile"
//               className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
//               onError={(e) => {
//                 e.target.src = "https://avatar.iran.liara.run/public";
//               }}
//             />
//             {editMode && (
//               <div className="absolute bottom-0 right-0 flex space-x-1">
//                 <button
//                   type="button"
//                   onClick={() => fileInputRef.current?.click()}
//                   disabled={imageUploading}
//                   className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50"
//                   title="Upload new image"
//                 >
//                   <FaCamera className="w-4 h-4" />
//                 </button>
//                 {getImageUrl(profile.profileImageURL) !==
//                   "https://avatar.iran.liara.run/public" && (
//                   <button
//                     type="button"
//                     onClick={handleDeleteImage}
//                     disabled={imageUploading}
//                     className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 disabled:opacity-50"
//                     title="Delete image"
//                   >
//                     <FaTrash className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleImageUpload}
//             accept="image/*"
//             className="hidden"
//           />
//           {editMode && (
//             <p className="text-sm text-gray-500 mt-2 text-center">
//               Click the camera icon to upload a new profile image
//               <br />
//               (Max size: 5MB, Formats: JPEG, PNG, GIF, WebP)
//             </p>
//           )}
//         </div>

//         {editMode ? (
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-gray-700 mb-2" htmlFor="name">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={profile.name}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2" htmlFor="email">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={profile.email}
//                   readOnly
//                   className="w-full p-2 border rounded bg-gray-100"
//                 />
//               </div>

//               <div>
//                 <label
//                   className="block text-gray-700 mb-2"
//                   htmlFor="university"
//                 >
//                   University
//                 </label>
//                 <input
//                   type="text"
//                   id="university"
//                   name="university"
//                   value={profile.university}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>

//               <div>
//                 <label
//                   className="block text-gray-700 mb-2"
//                   htmlFor="graduationYear"
//                 >
//                   Graduation Year
//                 </label>
//                 <input
//                   type="text"
//                   id="graduationYear"
//                   name="graduationYear"
//                   value={profile.graduationYear}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2" htmlFor="degree">
//                   Degree
//                 </label>
//                 <input
//                   type="text"
//                   id="degree"
//                   name="degree"
//                   value={profile.degree}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2" htmlFor="major">
//                   Major
//                 </label>
//                 <input
//                   type="text"
//                   id="major"
//                   name="major"
//                   value={profile.major}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>

//               <div>
//                 <label
//                   className="block text-gray-700 mb-2"
//                   htmlFor="phoneNumber"
//                 >
//                   Phone Number
//                 </label>
//                 <input
//                   type="text"
//                   id="phoneNumber"
//                   name="phoneNumber"
//                   value={profile.phoneNumber}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2" htmlFor="resumeUrl">
//                   Resume URL
//                 </label>
//                 <input
//                   type="url"
//                   id="resumeUrl"
//                   name="resumeUrl"
//                   value={profile.resumeUrl}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>

//               <div>
//                 <label
//                   className="block text-gray-700 mb-2"
//                   htmlFor="linkedinUrl"
//                 >
//                   LinkedIn URL
//                 </label>
//                 <input
//                   type="url"
//                   id="linkedinUrl"
//                   name="linkedinUrl"
//                   value={profile.linkedinUrl}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2" htmlFor="githubUrl">
//                   GitHub URL
//                 </label>
//                 <input
//                   type="url"
//                   id="githubUrl"
//                   name="githubUrl"
//                   value={profile.githubUrl}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//             </div>

//             <div className="mt-6">
//               <label className="block text-gray-700 mb-2" htmlFor="bio">
//                 Bio
//               </label>
//               <textarea
//                 id="bio"
//                 name="bio"
//                 value={profile.bio}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded h-32"
//               />
//             </div>

//             <div className="mt-6">
//               <label className="block text-gray-700 mb-2">Skills</label>
//               <div className="flex flex-wrap gap-2 mb-3">
//                 {profile.skills.map((skill, index) => (
//                   <div
//                     key={index}
//                     className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center"
//                   >
//                     {skill}
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveSkill(skill)}
//                       className="ml-2 text-indigo-600 hover:text-indigo-800"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex">
//                 <input
//                   type="text"
//                   value={newSkill}
//                   onChange={(e) => setNewSkill(e.target.value)}
//                   className="flex-1 p-2 border rounded-l"
//                   placeholder="Add a skill"
//                 />
//                 <button
//                   type="button"
//                   onClick={handleAddSkill}
//                   className="bg-indigo-600 text-white px-4 rounded-r hover:bg-indigo-700"
//                 >
//                   Add
//                 </button>
//               </div>
//             </div>

//             <div className="mt-6">
//               <button
//                 type="submit"
//                 className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//               >
//                 <FaSave className="mr-2" /> Save Profile
//               </button>
//             </div>
//           </form>
//         ) : (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <h3 className="text-gray-500 text-sm">Full Name</h3>
//                 <p className="font-medium">{profile.name}</p>
//               </div>

//               <div>
//                 <h3 className="text-gray-500 text-sm">Email Address</h3>
//                 <p className="font-medium">{profile.email}</p>
//               </div>

//               <div>
//                 <h3 className="text-gray-500 text-sm">University</h3>
//                 <p className="font-medium">
//                   {profile.university || "Not specified"}
//                 </p>
//               </div>

//               <div>
//                 <h3 className="text-gray-500 text-sm">Graduation Year</h3>
//                 <p className="font-medium">
//                   {profile.graduationYear || "Not specified"}
//                 </p>
//               </div>

//               <div>
//                 <h3 className="text-gray-500 text-sm">Degree</h3>
//                 <p className="font-medium">
//                   {profile.degree || "Not specified"}
//                 </p>
//               </div>

//               <div>
//                 <h3 className="text-gray-500 text-sm">Major</h3>
//                 <p className="font-medium">
//                   {profile.major || "Not specified"}
//                 </p>
//               </div>

//               <div>
//                 <h3 className="text-gray-500 text-sm">Phone Number</h3>
//                 <p className="font-medium">
//                   {profile.phoneNumber || "Not specified"}
//                 </p>
//               </div>
//             </div>

//             <div className="pt-4 border-t">
//               <h3 className="text-gray-500 text-sm">Bio</h3>
//               <p className="mt-2">
//                 {profile.bio || "No bio information provided."}
//               </p>
//             </div>

//             <div className="pt-4 border-t">
//               <h3 className="text-gray-500 text-sm">Skills</h3>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {profile.skills.length > 0 ? (
//                   profile.skills.map((skill, index) => (
//                     <span
//                       key={index}
//                       className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full"
//                     >
//                       {skill}
//                     </span>
//                   ))
//                 ) : (
//                   <p className="text-gray-500">No skills added yet.</p>
//                 )}
//               </div>
//             </div>

//             <div className="pt-4 border-t">
//               <h3 className="text-gray-500 text-sm">Links</h3>
//               <div className="mt-2 space-y-2">
//                 {profile.resumeUrl && (
//                   <div>
//                     <span className="font-medium">Resume: </span>
//                     <a
//                       href={profile.resumeUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-indigo-600 hover:text-indigo-800"
//                     >
//                       View Resume
//                     </a>
//                   </div>
//                 )}

//                 {profile.linkedinUrl && (
//                   <div>
//                     <span className="font-medium">LinkedIn: </span>
//                     <a
//                       href={profile.linkedinUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-indigo-600 hover:text-indigo-800"
//                     >
//                       {profile.linkedinUrl}
//                     </a>
//                   </div>
//                 )}

//                 {profile.githubUrl && (
//                   <div>
//                     <span className="font-medium">GitHub: </span>
//                     <a
//                       href={profile.githubUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-indigo-600 hover:text-indigo-800"
//                     >
//                       {profile.githubUrl}
//                     </a>
//                   </div>
//                 )}

//                 {!profile.resumeUrl &&
//                   !profile.linkedinUrl &&
//                   !profile.githubUrl && (
//                     <p className="text-gray-500">No links added yet.</p>
//                   )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentProfile;


import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { FaUser, FaEdit, FaSave, FaCamera, FaTrash } from "react-icons/fa";

const StudentProfile = ({ user }) => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    university: "",
    graduationYear: "",
    degree: "",
    major: "",
    skills: [],
    resumeUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    phoneNumber: "",
    profileImageURL: "https://avatar.iran.liara.run/public",
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Sync profile state with user prop when it changes
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        university: user.university || "",
        graduationYear: user.graduationYear || "",
        degree: user.degree || "",
        major: user.major || "",
        skills: user.skills || [],
        resumeUrl: user.resumeUrl || "",
        linkedinUrl: user.linkedinUrl || "",
        githubUrl: user.githubUrl || "",
        phoneNumber: user.phoneNumber || "",
        profileImageURL:
          user.profileImageURL || "https://avatar.iran.liara.run/public",
      });
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [user]);
  
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return "https://avatar.iran.liara.run/public";
    }

    // If it's already a full URL (https or external), return as is
    if (
      imageUrl.startsWith("https://") ||
      imageUrl.startsWith("http://avatar.iran.liara.run")
    ) {
      return imageUrl;
    }

    // If it's a relative path starting with /uploads, it will be proxied automatically
    if (imageUrl.startsWith("/uploads/")) {
      return imageUrl; // Vite proxy will handle this
    }

    // If it's an old full HTTP URL, convert to relative path
    if (imageUrl.startsWith("http://192.168.100.25:5000/")) {
      return imageUrl.replace("http://192.168.100.25:5000", "");
    }

    return imageUrl;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setSaveStatus(
        "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
      );
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSaveStatus("Image size should be less than 5MB");
      return;
    }

    setImageUploading(true);
    setSaveStatus("Uploading image...");

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await api.post("/user/upload-profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update profile state with new image URL
      setProfile((prev) => ({
        ...prev,
        profileImageURL: response.data.profileImageURL,
      }));

      setSaveStatus("Profile image updated successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Error uploading image:", error);
      setSaveStatus(
        error.response?.data?.message ||
          "Error uploading image. Please try again."
      );
    } finally {
      setImageUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (window.confirm("Are you sure you want to delete your profile image?")) {
      setImageUploading(true);
      setSaveStatus("Deleting image...");

      try {
        const response = await api.delete("/user/delete-profile-image");

        // Update profile state with default image
        setProfile((prev) => ({
          ...prev,
          profileImageURL: response.data.profileImageURL,
        }));

        setSaveStatus("Profile image deleted successfully!");
        setTimeout(() => setSaveStatus(""), 3000);
      } catch (error) {
        console.error("Error deleting image:", error);
        setSaveStatus("Error deleting image. Please try again.");
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus("Saving...");

    try {
      const response = await api.put("/student/profile", profile);
      setSaveStatus("Profile updated successfully!");
      setEditMode(false);
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveStatus("Error updating profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f4f7fa' }}>
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#123458' }}></div>
            <div className="text-lg font-medium" style={{ color: '#123458' }}>Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#f4f7fa' }}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b-2 flex justify-between items-center" style={{ backgroundColor: '#123458', borderColor: '#B8C8D9' }}>
            <div>
              <h1 className="text-3xl font-bold text-white">My Profile</h1>
              <p className="text-gray-200 mt-1">Manage your personal information</p>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center px-6 py-3 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: editMode ? '#D4C9BE' : '#B8C8D9', color: editMode ? '#123458' : 'white' }}
            >
              {editMode ? (
                <>
                  <FaUser className="mr-2" /> View Profile
                </>
              ) : (
                <>
                  <FaEdit className="mr-2" /> Edit Profile
                </>
              )}
            </button>
          </div>

          <div className="p-8">
            {saveStatus && (
              <div
                className={`mb-6 p-4 rounded-xl border-l-4 ${
                  saveStatus.includes("Error")
                    ? "bg-red-50 text-red-800 border-red-500"
                    : "bg-green-50 text-green-800 border-green-500"
                }`}
              >
                <div className="flex items-center">
                  <div className="font-medium">{saveStatus}</div>
                </div>
              </div>
            )}

            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="p-1 rounded-full" style={{ background: 'linear-gradient(135deg, #123458, #B8C8D9)' }}>
                  <img
                    src={getImageUrl(profile.profileImageURL)}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover bg-white"
                    onError={(e) => {
                      e.target.src = "https://avatar.iran.liara.run/public";
                    }}
                  />
                </div>
                {editMode && (
                  <div className="absolute -bottom-2 -right-2 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={imageUploading}
                      className="text-white p-3 rounded-full transition-all duration-200 transform hover:scale-110 hover:shadow-lg disabled:opacity-50"
                      style={{ backgroundColor: '#123458' }}
                      title="Upload new image"
                    >
                      <FaCamera className="w-5 h-5" />
                    </button>
                    {getImageUrl(profile.profileImageURL) !==
                      "https://avatar.iran.liara.run/public" && (
                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        disabled={imageUploading}
                        className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all duration-200 transform hover:scale-110 hover:shadow-lg disabled:opacity-50"
                        title="Delete image"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {editMode && (
                <div className="mt-4 p-4 rounded-xl text-center" style={{ backgroundColor: '#f4f7fa' }}>
                  <p className="text-sm font-medium" style={{ color: '#123458' }}>
                    Click the camera icon to upload a new profile image
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#B8C8D9' }}>
                    Max size: 5MB • Formats: JPEG, PNG, GIF, WebP
                  </p>
                </div>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="rounded-xl p-6" style={{ backgroundColor: '#f9fafc' }}>
                  <h3 className="text-xl font-semibold mb-6" style={{ color: '#123458' }}>Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-2" style={{ color: '#123458' }} htmlFor="name">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{ borderColor: '#B8C8D9', focusRingColor: '#123458' }}
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-2" style={{ color: '#123458' }} htmlFor="email">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        readOnly
                        className="w-full p-3 border-2 rounded-xl"
                        style={{ borderColor: '#B8C8D9', backgroundColor: '#f4f7fa' }}
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-2" style={{ color: '#123458' }} htmlFor="phoneNumber">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={profile.phoneNumber}
                        onChange={handleChange}
                        className="w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{ borderColor: '#B8C8D9', focusRingColor: '#123458' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="rounded-xl p-6" style={{ backgroundColor: '#f9fafc' }}>
                  <h3 className="text-xl font-semibold mb-6" style={{ color: '#123458' }}>Academic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-2" style={{ color: '#123458' }} htmlFor="university">
                        University
                      </label>
                      <input
                        type="text"
                        id="university"
                        name="university"
                        value={profile.university}
                        onChange={handleChange}
                        className="w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{ borderColor: '#B8C8D9', focusRingColor: '#123458' }}
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-2" style={{ color: '#123458' }} htmlFor="graduationYear">
                        Graduation Year
                      </label>
                      <input
                        type="text"
                        id="graduationYear"
                        name="graduationYear"
                        value={profile.graduationYear}
                        onChange={handleChange}
                        className="w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{ borderColor: '#B8C8D9', focusRingColor: '#123458' }}
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-2" style={{ color: '#123458' }} htmlFor="degree">
                        Degree
                      </label>
                      <input
                        type="text"
                        id="degree"
                        name="degree"
                        value={profile.degree}
                        onChange={handleChange}
                        className="w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{ borderColor: '#B8C8D9', focusRingColor: '#123458' }}
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-2" style={{ color: '#123458' }} htmlFor="major">
                        Major
                      </label>
                      <input
                        type="text"
                        id="major"
                        name="major"
                        value={profile.major}
                        onChange={handleChange}
                        className="w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{ borderColor: '#B8C8D9', focusRingColor: '#123458' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="rounded-xl p-6" style={{ backgroundColor: '#f9fafc' }}>
                  <h3 className="text-xl font-semibold mb-6" style={{ color: '#123458' }}>About Me</h3>
                  <div>
                    <label className="block font-medium mb-2" style={{ color: '#123458' }} htmlFor="bio">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      className="w-full p-3 border-2 rounded-xl h-32 focus:outline-none focus:ring-2 transition-all duration-200 resize-none"
                      style={{ borderColor: '#B8C8D9', focusRingColor: '#123458' }}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>

                {/* Skills Section */}
                <div className="rounded-xl p-6" style={{ backgroundColor: '#f9fafc' }}>
                  <h3 className="text-xl font-semibold mb-6" style={{ color: '#123458' }}>Skills</h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {profile.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 rounded-full flex items-center font-medium"
                        style={{ backgroundColor: '#D4C9BE', color: '#123458' }}
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 hover:text-red-600 transition-colors duration-200"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex rounded-xl overflow-hidden">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="flex-1 p-3 border-2 border-r-0 focus:outline-none focus:ring-2 transition-all duration-200"
                      style={{ borderColor: '#B8C8D9', focusRingColor: '#123458' }}
                      placeholder="Add a skill"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="text-white px-6 font-medium hover:opacity-90 transition-all duration-200"
                      style={{ backgroundColor: '#123458' }}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Links Section */}
                <div className="rounded-xl p-6" style={{ backgroundColor: '#f9fafc' }}>
                  <h3 className="text-xl font-semibold mb-6" style={{ color: '#123458' }}>Professional Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block font-medium mb-2" style={{ color: '#123458' }} htmlFor="resumeUrl">
                        Resume URL
                      </label>
                      <input
                        type="url"
                        id="resumeUrl"
                        name="resumeUrl"
                        value={profile.resumeUrl}
                        onChange={handleChange}
                        className="w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{ borderColor: '#B8C8D9', focusRingColor: '#123458' }}
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-2" style={{ color: '#123458' }} htmlFor="linkedinUrl">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        id="linkedinUrl"
                        name="linkedinUrl"
                        value={profile.linkedinUrl}
                        onChange={handleChange}
                        className="w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{ borderColor: '#B8C8D9', focusRingColor: '#123458' }}
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-2" style={{ color: '#123458' }} htmlFor="githubUrl">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        id="githubUrl"
                        name="githubUrl"
                        value={profile.githubUrl}
                        onChange={handleChange}
                        className="w-full p-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{ borderColor: '#B8C8D9', focusRingColor: '#123458' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <button
                    type="submit"
                    className="flex items-center px-8 py-4 text-white rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                    style={{ backgroundColor: '#123458' }}
                  >
                    <FaSave className="mr-3" /> Save Profile
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                {/* Personal Information Display */}
                <div className="rounded-xl p-6" style={{ backgroundColor: '#f9fafc' }}>
                  <h3 className="text-xl font-semibold mb-6" style={{ color: '#123458' }}>Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'white' }}>
                      <h4 className="text-sm font-medium mb-1" style={{ color: '#B8C8D9' }}>Full Name</h4>
                      <p className="text-lg font-semibold" style={{ color: '#123458' }}>{profile.name}</p>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'white' }}>
                      <h4 className="text-sm font-medium mb-1" style={{ color: '#B8C8D9' }}>Email Address</h4>
                      <p className="text-lg font-semibold" style={{ color: '#123458' }}>{profile.email}</p>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'white' }}>
                      <h4 className="text-sm font-medium mb-1" style={{ color: '#B8C8D9' }}>Phone Number</h4>
                      <p className="text-lg font-semibold" style={{ color: '#123458' }}>
                        {profile.phoneNumber || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Academic Information Display */}
                <div className="rounded-xl p-6" style={{ backgroundColor: '#f9fafc' }}>
                  <h3 className="text-xl font-semibold mb-6" style={{ color: '#123458' }}>Academic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'white' }}>
                      <h4 className="text-sm font-medium mb-1" style={{ color: '#B8C8D9' }}>University</h4>
                      <p className="text-lg font-semibold" style={{ color: '#123458' }}>
                        {profile.university || "Not specified"}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'white' }}>
                      <h4 className="text-sm font-medium mb-1" style={{ color: '#B8C8D9' }}>Graduation Year</h4>
                      <p className="text-lg font-semibold" style={{ color: '#123458' }}>
                        {profile.graduationYear || "Not specified"}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'white' }}>
                      <h4 className="text-sm font-medium mb-1" style={{ color: '#B8C8D9' }}>Degree</h4>
                      <p className="text-lg font-semibold" style={{ color: '#123458' }}>
                        {profile.degree || "Not specified"}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'white' }}>
                      <h4 className="text-sm font-medium mb-1" style={{ color: '#B8C8D9' }}>Major</h4>
                      <p className="text-lg font-semibold" style={{ color: '#123458' }}>
                        {profile.major || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bio Display */}
                <div className="rounded-xl p-6" style={{ backgroundColor: '#f9fafc' }}>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: '#123458' }}>About Me</h3>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'white' }}>
                    <p className="text-lg leading-relaxed" style={{ color: '#123458' }}>
                      {profile.bio || "No bio information provided."}
                    </p>
                  </div>
                </div>

                {/* Skills Display */}
                <div className="rounded-xl p-6" style={{ backgroundColor: '#f9fafc' }}>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: '#123458' }}>Skills</h3>
                  <div className="flex flex-wrap gap-3">
                    {profile.skills.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full font-medium"
                          style={{ backgroundColor: '#D4C9BE', color: '#123458' }}
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-lg" style={{ color: '#B8C8D9' }}>No skills added yet.</p>
                    )}
                  </div>
                </div>

                {/* Links Display */}
                <div className="rounded-xl p-6" style={{ backgroundColor: '#f9fafc' }}>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: '#123458' }}>Professional Links</h3>
                  <div className="space-y-4">
                    {profile.resumeUrl && (
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'white' }}>
                        <span className="font-semibold" style={{ color: '#123458' }}>Resume: </span>
                        <a
                          href={profile.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline transition-all duration-200"
                          style={{ color: '#B8C8D9' }}
                        >
                          View Resume
                        </a>
                      </div>
                    )}

                    {profile.linkedinUrl && (
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'white' }}>
                        <span className="font-semibold" style={{ color: '#123458' }}>LinkedIn: </span>
                        <a
                          href={profile.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline transition-all duration-200 break-all"
                          style={{ color: '#B8C8D9' }}
                        >
                          {profile.linkedinUrl}
                        </a>
                      </div>
                    )}

                    {profile.githubUrl && (
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'white' }}>
                        <span className="font-semibold" style={{ color: '#123458' }}>GitHub: </span>
                        <a
                          href={profile.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline transition-all duration-200 break-all"
                          style={{ color: '#B8C8D9' }}
                        >
                          {profile.githubUrl}
                        </a>
                      </div>
                    )}

                    {!profile.resumeUrl &&
                      !profile.linkedinUrl &&
                      !profile.githubUrl && (
                        <p className="text-lg" style={{ color: '#B8C8D9' }}>No links added yet.</p>
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
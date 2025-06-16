// // frontend/src/components/student/ProjectList.js
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import api from "../../services/api"; // Adjust the import based on your project structure
// import { FaSearch, FaFilter, FaStar } from "react-icons/fa";

// const ProjectList = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     skills: [],
//     status: "Open",
//     duration: "",
//     compensation: "",
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         // Build query params
//         const params = {};
//         if (filters.skills.length > 0) params.skills = filters.skills.join(",");
//         if (filters.status) params.status = filters.status;
//         if (filters.duration) params.duration = filters.duration;
//         if (filters.compensation) params.compensation = filters.compensation;

//         const response = await api.get("/student/projects", {
//           params,
//         });

//         setProjects(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, [filters]);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSkillsChange = (e) => {
//     const skills = e.target.value
//       .split(",")
//       .map((skill) => skill.trim())
//       .filter(Boolean);
//     setFilters((prev) => ({
//       ...prev,
//       skills,
//     }));
//   };

//   const toggleFilters = () => {
//     setShowFilters(!showFilters);
//   };

//   const filteredProjects = projects.filter(
//     (project) =>
//       project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       project.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Available Projects</h1>
//         <div className="flex items-center">
//           <div className="relative mr-4">
//             <input
//               type="text"
//               placeholder="Search projects..."
//               className="py-2 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <FaSearch className="absolute right-3 top-3 text-gray-400" />
//           </div>
//           <button
//             onClick={toggleFilters}
//             className="bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center"
//           >
//             <FaFilter className="mr-2" /> Filters
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       {showFilters && (
//         <div className="bg-white p-6 mb-6 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-4">Filter Projects</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Skills
//               </label>
//               <input
//                 type="text"
//                 name="skills"
//                 placeholder="React, Node.js, MongoDB"
//                 className="w-full p-2 border rounded-md"
//                 value={filters.skills.join(", ")}
//                 onChange={handleSkillsChange}
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Separate skills with commas
//               </p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Status
//               </label>
//               <select
//                 name="status"
//                 className="w-full p-2 border rounded-md"
//                 value={filters.status}
//                 onChange={handleFilterChange}
//               >
//                 <option value="Open">Open</option>
//                 <option value="Occupied">Occupied</option>
//                 <option value="Completed">Completed</option>
//                 <option value="">All</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Duration
//               </label>
//               <select
//                 name="duration"
//                 className="w-full p-2 border rounded-md"
//                 value={filters.duration}
//                 onChange={handleFilterChange}
//               >
//                 <option value="">Any</option>
//                 <option value="1 week">1 week</option>
//                 <option value="2 weeks">2 weeks</option>
//                 <option value="1 month">1 month</option>
//                 <option value="2 months">2 months</option>
//                 <option value="3 months">3 months</option>
//                 <option value="6 months">6 months</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Compensation
//               </label>
//               <select
//                 name="compensation"
//                 className="w-full p-2 border rounded-md"
//                 value={filters.compensation}
//                 onChange={handleFilterChange}
//               >
//                 <option value="">Any</option>
//                 <option value="Paid">Paid</option>
//                 <option value="Unpaid">Unpaid</option>
//                 <option value="Certificate">Certificate</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Project List */}
//       {loading ? (
//         <div className="text-center py-8">
//           <p className="text-gray-500">Loading projects...</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredProjects.length > 0 ? (
//             filteredProjects.map((project) => (
//               <ProjectCard key={project._id} project={project} />
//             ))
//           ) : (
//             <div className="col-span-3 text-center py-8">
//               <p className="text-gray-500">
//                 No projects found matching your criteria.
//               </p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const ProjectCard = ({ project }) => {
//   const deadline = new Date(project.deadline);
//   const today = new Date();
//   const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden">
//       <div className="p-5">
//         <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
//         <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

//         <div className="flex flex-wrap gap-2 mb-4">
//           {project.skills.slice(0, 3).map((skill, index) => (
//             <span
//               key={index}
//               className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded"
//             >
//               {skill}
//             </span>
//           ))}
//           {project.skills.length > 3 && (
//             <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
//               +{project.skills.length - 3} more
//             </span>
//           )}
//         </div>

//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center">
//             <span className="text-sm text-gray-500 mr-4">
//               Duration: {project.duration}
//             </span>
//             <span className="text-sm text-gray-500">
//               {project.compensation}
//             </span>
//           </div>
//           <div
//             className={`text-sm px-2 py-1 rounded ${
//               daysLeft < 3
//                 ? "bg-red-100 text-red-800"
//                 : daysLeft < 7
//                 ? "bg-yellow-100 text-yellow-800"
//                 : "bg-green-100 text-green-800"
//             }`}
//           >
//             {daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}
//           </div>
//         </div>

//         <div className="flex justify-between items-center">
//           <div className="text-sm text-gray-500">
//             Posted by: {project.alumni ? project.alumni.name : "Alumni"}
//           </div>
//           <Link
//             to={`/student/projects/${project._id}`}
//             className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
//           >
//             View Details
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectList;


// frontend/src/components/student/ProjectList.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../../services/api"; // Adjust the import based on your project structure
import { FaSearch, FaFilter, FaStar } from "react-icons/fa";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    skills: [],
    status: "Open",
    duration: "",
    compensation: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        // Build query params
        const params = {};
        if (filters.skills.length > 0) params.skills = filters.skills.join(",");
        if (filters.status) params.status = filters.status;
        if (filters.duration) params.duration = filters.duration;
        if (filters.compensation) params.compensation = filters.compensation;

        const response = await api.get("/student/projects", {
          params,
        });

        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    setFilters((prev) => ({
      ...prev,
      skills,
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ 
      backgroundColor: '#f4f7fa',
      minHeight: '100vh' 
    }} className="p-6">
      {/* Header Section with Enhanced Design */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-3xl blur-xl" style={{ backgroundColor: '#B8C8D9', opacity: 0.1 }}></div>
        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                Discover Amazing Projects
              </h1>
              <p className="text-gray-600 text-lg">Find the perfect project to showcase your skills and grow your portfolio</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search for your next adventure..."
                  className="py-3 px-6 pr-12 w-full sm:w-80 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl"
                  style={{ 
                    focusRingColor: '#123458',
                    '--tw-ring-color': '#123458',
                    '--tw-ring-opacity': '0.2'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#123458';
                    e.target.style.boxShadow = '0 0 0 4px rgba(18, 52, 88, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '';
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200" 
                     style={{ color: searchTerm ? '#123458' : undefined }}>
                  <FaSearch className="text-lg" />
                </div>
              </div>
              
              <button
                onClick={toggleFilters}
                className="px-8 py-3 rounded-2xl flex items-center justify-center font-medium text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                style={{ 
                  backgroundColor: showFilters ? '#123458' : '#B8C8D9',
                  boxShadow: showFilters ? '0 0 0 4px rgba(18, 52, 88, 0.2)' : undefined
                }}
                onMouseEnter={(e) => {
                  if (!showFilters) e.target.style.backgroundColor = '#123458';
                }}
                onMouseLeave={(e) => {
                  if (!showFilters) e.target.style.backgroundColor = '#B8C8D9';
                }}
              >
                <FaFilter className="mr-2" /> 
                <span className="hidden sm:inline">Advanced </span>Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters Section */}
      {showFilters && (
        <div className="mb-8 transform transition-all duration-500 ease-out">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 rounded-full mr-4" style={{ backgroundColor: '#123458' }}></div>
              <h2 className="text-2xl font-bold text-gray-800">Refine Your Search</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold mb-3 transition-colors duration-200" style={{ color: '#123458' }}>
                  💡 Required Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  placeholder="React, Node.js, MongoDB..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none transition-all duration-300 bg-white/80 hover:bg-white hover:shadow-lg"
                  style={{ focusRingColor: '#123458' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#123458';
                    e.target.style.boxShadow = '0 0 0 4px rgba(18, 52, 88, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '';
                  }}
                  value={filters.skills.join(", ")}
                  onChange={handleSkillsChange}
                />
                <p className="text-xs text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  💡 Separate multiple skills with commas
                </p>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold mb-3 transition-colors duration-200" style={{ color: '#123458' }}>
                  📊 Project Status
                </label>
                <select
                  name="status"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none transition-all duration-300 bg-white/80 hover:bg-white hover:shadow-lg cursor-pointer"
                  style={{ focusRingColor: '#123458' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#123458';
                    e.target.style.boxShadow = '0 0 0 4px rgba(18, 52, 88, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '';
                  }}
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="Open">🟢 Open for Applications</option>
                  <option value="Occupied">🟡 Currently Occupied</option>
                  <option value="Completed">✅ Completed Projects</option>
                  <option value="">🔍 Show All Status</option>
                </select>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold mb-3 transition-colors duration-200" style={{ color: '#123458' }}>
                  ⏰ Project Duration
                </label>
                <select
                  name="duration"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none transition-all duration-300 bg-white/80 hover:bg-white hover:shadow-lg cursor-pointer"
                  style={{ focusRingColor: '#123458' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#123458';
                    e.target.style.boxShadow = '0 0 0 4px rgba(18, 52, 88, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '';
                  }}
                  value={filters.duration}
                  onChange={handleFilterChange}
                >
                  <option value="">Any Duration</option>
                  <option value="1 week">⚡ 1 week (Quick Sprint)</option>
                  <option value="2 weeks">🏃 2 weeks (Short Term)</option>
                  <option value="1 month">📅 1 month (Standard)</option>
                  <option value="2 months">🎯 2 months (Extended)</option>
                  <option value="3 months">🚀 3 months (Long Term)</option>
                  <option value="6 months">🏔️ 6 months (Major Project)</option>
                </select>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold mb-3 transition-colors duration-200" style={{ color: '#123458' }}>
                  💰 Compensation Type
                </label>
                <select
                  name="compensation"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none transition-all duration-300 bg-white/80 hover:bg-white hover:shadow-lg cursor-pointer"
                  style={{ focusRingColor: '#123458' }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#123458';
                    e.target.style.boxShadow = '0 0 0 4px rgba(18, 52, 88, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = '';
                  }}
                  value={filters.compensation}
                  onChange={handleFilterChange}
                >
                  <option value="">Any Compensation</option>
                  <option value="Paid">💵 Paid Position</option>
                  <option value="Unpaid">🤝 Volunteer/Experience</option>
                  <option value="Certificate">🏆 Certificate & Recognition</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Project List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 shadow-lg" style={{ borderTopColor: '#123458' }}></div>
            <div className="absolute inset-0 rounded-full blur-xl animate-pulse" style={{ backgroundColor: '#B8C8D9', opacity: 0.2 }}></div>
          </div>
          <p className="text-gray-600 mt-6 text-xl font-medium">Discovering amazing projects for you...</p>
          <p className="text-gray-500 mt-2">This won't take long!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <div key={project._id} 
                   className="animate-fadeInUp" 
                   style={{ animationDelay: `${index * 100}ms` }}>
                <ProjectCard project={project} />
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-16">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/50 max-w-md mx-auto">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Projects Found</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  We couldn't find any projects matching your search criteria. Try adjusting your filters or search terms!
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({
                      skills: [],
                      status: "Open",
                      duration: "",
                      compensation: "",
                    });
                  }}
                  className="px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  style={{ backgroundColor: '#123458' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#B8C8D9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#123458'}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  const deadline = new Date(project.deadline);
  const today = new Date();
  const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

  return (
    <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] relative">
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" style={{ backgroundColor: '#B8C8D9', opacity: 0.2 }}></div>
      
      <div className="relative p-8">
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            project.status === 'Open' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
          }`}>
            {project.status === 'Open' ? '🟢 OPEN' : '🟡 OCCUPIED'}
          </div>
        </div>

        {/* Project Title */}
        <h3 className="text-2xl font-bold mb-4 text-gray-800 transition-colors duration-300 pr-20" 
            onMouseEnter={(e) => e.target.style.color = '#123458'}
            onMouseLeave={(e) => e.target.style.color = '#1f2937'}>
          {project.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed text-base">
          {project.description}
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="text-sm px-4 py-2 rounded-full font-medium text-white transition-all duration-200 transform hover:scale-105 shadow-md"
              style={{ backgroundColor: '#B8C8D9' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#123458'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#B8C8D9'}
            >
              {skill}
            </span>
          ))}
          {project.skills.length > 3 && (
            <span 
              className="text-sm px-4 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105 border-2"
              style={{ 
                color: '#123458', 
                backgroundColor: '#D4C9BE',
                borderColor: '#B8C8D9'
              }}
            >
              +{project.skills.length - 3} more skills
            </span>
          )}
        </div>

        {/* Project Details */}
        <div className="bg-gray-50/80 rounded-xl p-4 mb-6 border border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <span className="text-2xl mr-2">⏱️</span>
              <div>
                <p className="text-gray-500 text-xs">Duration</p>
                <p className="font-semibold text-gray-800">{project.duration}</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">💰</span>
              <div>
                <p className="text-gray-500 text-xs">Type</p>
                <p className="font-semibold text-gray-800">{project.compensation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deadline Warning */}
        <div className="mb-6">
          <div
            className={`inline-flex items-center text-sm px-4 py-2 rounded-xl font-semibold ${
              daysLeft < 3
                ? "bg-red-50 text-red-700 border-2 border-red-200"
                : daysLeft < 7
                ? "bg-yellow-50 text-yellow-700 border-2 border-yellow-200"
                : "bg-green-50 text-green-700 border-2 border-green-200"
            }`}
          >
            <span className="mr-2">
              {daysLeft < 3 ? "🚨" : daysLeft < 7 ? "⚠️" : "✅"}
            </span>
            {daysLeft > 0 ? `${daysLeft} days remaining` : "Deadline has passed"}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-6 border-t-2 border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3" style={{ backgroundColor: '#123458' }}>
              {project.alumni ? project.alumni.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <p className="text-xs text-gray-500">Posted by</p>
              <p className="font-semibold text-gray-800">
                {project.alumni ? project.alumni.name : "Alumni"}
              </p>
            </div>
          </div>
          
          <Link
            to={`/student/projects/${project._id}`}
            className="group/btn relative px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl overflow-hidden"
            style={{ backgroundColor: '#123458' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#B8C8D9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#123458'}
          >
            <span className="relative z-10">View Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import api from "../../services/api";
// import {
//   FaBriefcase,
//   FaBuilding,
//   FaMapMarkerAlt,
//   FaCalendarAlt,
//   FaMoneyBillWave,
// } from "react-icons/fa";

// const InternshipList = () => {
//   const [internships, setInternships] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     location: "",
//     isRemote: "",
//     skills: "",
//     stipend: "",
//   });
//   const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     fetchInternships();
//   }, []);

//   const fetchInternships = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       // Build query string from filters
//       const queryParams = new URLSearchParams();
//       if (filters.location) queryParams.append("location", filters.location);
//       if (filters.isRemote) queryParams.append("isRemote", filters.isRemote);
//       if (filters.skills) queryParams.append("skills", filters.skills);
//       if (filters.stipend) queryParams.append("stipend", filters.stipend);

//       const response = await api.get(
//         `/student/internships?${queryParams.toString()}`
//       );

//       setInternships(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching internships:", error);
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters({
//       ...filters,
//       [name]: value,
//     });
//   };

//   const applyFilters = (e) => {
//     e.preventDefault();
//     fetchInternships();
//   };

//   const resetFilters = () => {
//     setFilters({
//       location: "",
//       isRemote: "",
//       skills: "",
//       stipend: "",
//     });
//     // Reset will fetch all internships
//     setTimeout(fetchInternships, 0);
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Available Internships</h1>
//         <button
//           onClick={() => setShowFilters(!showFilters)}
//           className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
//         >
//           {showFilters ? "Hide Filters" : "Show Filters"}
//         </button>
//       </div>

//       {/* Filters */}
//       {showFilters && (
//         <div className="bg-white rounded-lg shadow p-6 mb-6">
//           <h2 className="text-lg font-semibold mb-4">Filter Internships</h2>
//           <form onSubmit={applyFilters}>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Location
//                 </label>
//                 <input
//                   type="text"
//                   name="location"
//                   value={filters.location}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border rounded focus:ring focus:ring-indigo-200"
//                   placeholder="City or Country"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Remote Work
//                 </label>
//                 <select
//                   name="isRemote"
//                   value={filters.isRemote}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border rounded focus:ring focus:ring-indigo-200"
//                 >
//                   <option value="">All Types</option>
//                   <option value="true">Remote Only</option>
//                   <option value="false">On-site Only</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Skills (comma separated)
//                 </label>
//                 <input
//                   type="text"
//                   name="skills"
//                   value={filters.skills}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border rounded focus:ring focus:ring-indigo-200"
//                   placeholder="e.g. React, Node.js"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Minimum Stipend
//                 </label>
//                 <input
//                   type="text"
//                   name="stipend"
//                   value={filters.stipend}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border rounded focus:ring focus:ring-indigo-200"
//                   placeholder="e.g. 5000"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end mt-4 space-x-2">
//               <button
//                 type="button"
//                 onClick={resetFilters}
//                 className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
//               >
//                 Reset
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Internships List */}
//       {loading ? (
//         <div className="text-center py-10">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
//           <p className="mt-2 text-gray-500">Loading internships...</p>
//         </div>
//       ) : internships.length === 0 ? (
//         <div className="bg-white rounded-lg shadow p-10 text-center">
//           <p className="text-gray-500">
//             No internships found with the selected filters.
//           </p>
//           <button
//             onClick={resetFilters}
//             className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//           >
//             Reset Filters
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {internships.map((internship) => (
//             <div
//               key={internship._id}
//               className="bg-white rounded-lg shadow overflow-hidden"
//             >
//               <div className="p-6">
//                 <h2 className="text-xl font-semibold mb-2">
//                   {internship.title}
//                 </h2>
//                 <div className="flex items-center text-gray-600 mb-2">
//                   <FaBuilding className="mr-2" />
//                   <span>
//                     {internship.company ||
//                       (internship.alumni && internship.alumni.company) ||
//                       "Company"}
//                   </span>
//                 </div>
//                 <div className="flex items-center text-gray-600 mb-2">
//                   <FaMapMarkerAlt className="mr-2" />
//                   <span>
//                     {internship.location || "Location not specified"}{" "}
//                     {internship.isRemote && "(Remote)"}
//                   </span>
//                 </div>
//                 <div className="flex items-center text-gray-600 mb-2">
//                   <FaCalendarAlt className="mr-2" />
//                   <span>
//                     Duration: {internship.duration || "Not specified"}
//                   </span>
//                 </div>
//                 <div className="flex items-center text-gray-600 mb-4">
//                   <FaMoneyBillWave className="mr-2" />
//                   <span>Stipend: {internship.stipend || "Not specified"}</span>
//                 </div>

//                 <p className="text-gray-600 mb-4 line-clamp-3">
//                   {internship.description}
//                 </p>

//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {internship.skills &&
//                     internship.skills.map((skill, index) => (
//                       <span
//                         key={index}
//                         className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">
//                     {internship.applicationCount || 0} applicants
//                   </span>
//                   <Link
//                     to={`/student/internships/${internship._id}`}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//                   >
//                     View Details
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default InternshipList;



import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaFilter,
  FaTimes,
  FaSearch,
  FaUsers,
  FaLaptop,
  FaHome,
  FaEye,
  FaGlobe,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    isRemote: "",
    skills: "",
    stipend: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.location) queryParams.append("location", filters.location);
      if (filters.isRemote) queryParams.append("isRemote", filters.isRemote);
      if (filters.skills) queryParams.append("skills", filters.skills);
      if (filters.stipend) queryParams.append("stipend", filters.stipend);

      const response = await api.get(
        `/student/internships?${queryParams.toString()}`
      );

      setInternships(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching internships:", error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  const resetFilters = () => {
    setFilters({
      location: "",
      isRemote: "",
      skills: "",
      stipend: "",
    });
    setTimeout(fetchInternships, 0);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== "").length;
  };

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: '#f4f7fa' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-l-4" style={{ borderColor: '#123458' }}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: '#123458' }}>
                Available Internships
              </h1>
              <p className="text-gray-600 text-lg">
                Discover amazing internship opportunities from our alumni network
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {getActiveFiltersCount() > 0 && (
                <div className="flex items-center px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: '#D4C9BE', color: '#123458' }}>
                  <FaFilter className="mr-2" />
                  {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} active
                </div>
              )}
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 hover:transform hover:scale-105 shadow-lg"
                style={{ backgroundColor: '#123458' }}
              >
                <FaFilter className="mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center" style={{ color: '#123458' }}>
                <FaSearch className="mr-3" />
                Filter Internships
              </h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={applyFilters}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{ 
                      borderColor: '#B8C8D9',
                      focusRingColor: '#123458'
                    }}
                    placeholder="City or Country"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaLaptop className="inline mr-2" />
                    Work Type
                  </label>
                  <select
                    name="isRemote"
                    value={filters.isRemote}
                    onChange={handleFilterChange}
                    className="w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{ 
                      borderColor: '#B8C8D9',
                      focusRingColor: '#123458'
                    }}
                  >
                    <option value="">All Types</option>
                    <option value="true">Remote Only</option>
                    <option value="false">On-site Only</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaBriefcase className="inline mr-2" />
                    Skills
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={filters.skills}
                    onChange={handleFilterChange}
                    className="w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{ 
                      borderColor: '#B8C8D9',
                      focusRingColor: '#123458'
                    }}
                    placeholder="e.g. React, Node.js"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaMoneyBillWave className="inline mr-2" />
                    Min. Stipend
                  </label>
                  <input
                    type="text"
                    name="stipend"
                    value={filters.stipend}
                    onChange={handleFilterChange}
                    className="w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{ 
                      borderColor: '#B8C8D9',
                      focusRingColor: '#123458'
                    }}
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-8 space-x-4">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-6 py-3 border-2 rounded-xl font-medium transition-all duration-200 hover:transform hover:scale-105"
                  style={{ 
                    borderColor: '#B8C8D9',
                    color: '#123458'
                  }}
                >
                  Reset Filters
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl text-white font-bold transition-all duration-200 hover:transform hover:scale-105 shadow-lg"
                  style={{ backgroundColor: '#123458' }}
                >
                  Apply Filters
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: '#123458' }}></div>
              <p className="text-gray-600 text-lg">Loading internships...</p>
            </div>
          </div>
        ) : internships.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="mb-6">
              <FaSearch className="text-6xl mx-auto mb-4" style={{ color: '#B8C8D9' }} />
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#123458' }}>
                No Internships Found
              </h3>
              <p className="text-gray-600 text-lg">
                No internships match your current filters. Try adjusting your search criteria.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="px-8 py-3 rounded-xl text-white font-bold transition-all duration-200 hover:transform hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#123458' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <h3 className="text-xl font-semibold text-gray-700 mr-4">
                  Found {internships.length} internship{internships.length !== 1 ? 's' : ''}
                </h3>
                {getActiveFiltersCount() > 0 && (
                  <span className="text-sm text-gray-500">
                    (filtered results)
                  </span>
                )}
              </div>
            </div>

            {/* Internships Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {internships.map((internship) => (
                <div
                  key={internship._id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border-t-4"
                  style={{ borderColor: '#123458' }}
                >
                  <div className="p-8">
                    {/* Header */}
                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-3" style={{ color: '#123458' }}>
                        {internship.title}
                      </h2>
                      
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <FaBuilding className="mr-3 flex-shrink-0" style={{ color: '#123458' }} />
                          <span className="font-medium">
                            {internship.company ||
                              (internship.alumni && internship.alumni.company) ||
                              "Company"}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <FaMapMarkerAlt className="mr-3 flex-shrink-0" style={{ color: '#123458' }} />
                          <span>
                            {internship.location || "Location not specified"}
                          </span>
                          {internship.isRemote && (
                            <span className="ml-2 px-2 py-1 text-xs rounded-lg font-medium" style={{ backgroundColor: '#D4C9BE', color: '#123458' }}>
                              <FaLaptop className="inline mr-1" />
                              Remote
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <FaCalendarAlt className="mr-3 flex-shrink-0" style={{ color: '#123458' }} />
                          <span>Duration: {internship.duration || "Not specified"}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <FaMoneyBillWave className="mr-3 flex-shrink-0" style={{ color: '#123458' }} />
                          <span className="font-semibold">
                            Stipend: {internship.stipend || "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <p className="text-gray-600 line-clamp-3 leading-relaxed">
                        {internship.description}
                      </p>
                    </div>

                    {/* Skills */}
                    {internship.skills && internship.skills.length > 0 && (
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {internship.skills.slice(0, 4).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 text-sm font-medium rounded-lg text-white"
                              style={{ backgroundColor: '#123458' }}
                            >
                              {skill}
                            </span>
                          ))}
                          {internship.skills.length > 4 && (
                            <span className="px-3 py-1 text-sm font-medium rounded-lg" style={{ backgroundColor: '#B8C8D9', color: '#123458' }}>
                              +{internship.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-6 border-t" style={{ borderColor: '#B8C8D9' }}>
                      <div className="flex items-center text-gray-500">
                        <FaUsers className="mr-2" />
                        <span className="text-sm">
                          {internship.applicationCount || 0} applicant{(internship.applicationCount || 0) !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <Link
                        to={`/student/internships/${internship._id}`}
                        className="flex items-center px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 hover:transform hover:scale-105 shadow-lg"
                        style={{ backgroundColor: '#123458' }}
                      >
                        <FaEye className="mr-2" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipList;
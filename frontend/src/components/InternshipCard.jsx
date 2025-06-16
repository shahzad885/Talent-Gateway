// src/components/InternshipCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaDollarSign, 
  FaBuilding, 
  FaWifi,
  FaEye,
  FaTags 
} from "react-icons/fa";

const InternshipCard = ({ internship }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "Open":
        return {
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          dotColor: "bg-emerald-500"
        };
      case "Occupied":
        return {
          color: "text-[#123458]",
          bgColor: "bg-[#B8C8D9] bg-opacity-20",
          borderColor: "border-[#B8C8D9]",
          dotColor: "bg-[#123458]"
        };
      case "Closed":
        return {
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          dotColor: "bg-gray-400"
        };
      default:
        return {
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          dotColor: "bg-gray-400"
        };
    }
  };

  const statusConfig = getStatusConfig(internship.status);

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#B8C8D9] border-opacity-20 overflow-hidden">
      {/* Gradient Background Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#123458] via-[#B8C8D9] to-[#D4C9BE]"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full transform translate-x-16 -translate-y-16 bg-gradient-to-br from-[#B8C8D9] to-[#D4C9BE]"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full transform -translate-x-8 translate-y-8 bg-gradient-to-br from-[#123458] to-[#B8C8D9]"></div>
      </div>

      <div className="relative p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-4">
            <Link to={`/alumni/internships/${internship._id}`}>
              <h3 className="font-bold text-lg text-[#123458] hover:text-[#1e4a73] transition-colors duration-200 line-clamp-2 group-hover:text-[#1e4a73]">
                {internship.title}
              </h3>
            </Link>
            <div className="flex items-center mt-2 text-gray-600">
              <FaBuilding className="text-[#B8C8D9] text-sm mr-2" />
              <span className="text-sm font-medium">{internship.company}</span>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`flex items-center px-3 py-2 rounded-xl ${statusConfig.bgColor} ${statusConfig.borderColor} border backdrop-blur-sm`}>
            <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor} mr-2 animate-pulse`}></div>
            <span className={`text-sm font-semibold ${statusConfig.color}`}>
              {internship.status}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
          {internship.description}
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <FaTags className="text-[#D4C9BE] text-sm mt-1 mr-1" />
          {internship.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-[#B8C8D9] to-[#D4C9BE] bg-opacity-20 text-[#123458] text-xs font-medium rounded-full border border-[#B8C8D9] border-opacity-30 backdrop-blur-sm"
            >
              {skill}
            </span>
          ))}
          {internship.skills.length > 3 && (
            <span className="px-3 py-1 bg-gradient-to-r from-[#D4C9BE] to-[#B8C8D9] bg-opacity-20 text-[#123458] text-xs font-medium rounded-full border border-[#D4C9BE] border-opacity-30 backdrop-blur-sm">
              +{internship.skills.length - 3} more
            </span>
          )}
        </div>

        {/* Details Grid */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#f4f7fa] to-[#B8C8D9] bg-opacity-10 rounded-xl border border-[#B8C8D9] border-opacity-20">
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-[#D4C9BE] text-sm mr-3" />
              <span className="text-sm text-gray-600 font-medium">Location</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-semibold text-[#123458]">
                {internship.location}
              </span>
              {internship.isRemote && (
                <div className="ml-2 flex items-center px-2 py-1 bg-[#B8C8D9] bg-opacity-20 rounded-full">
                  <FaWifi className="text-[#123458] text-xs mr-1" />
                  <span className="text-xs font-medium text-[#123458]">Remote</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#f4f7fa] to-[#D4C9BE] bg-opacity-10 rounded-xl border border-[#D4C9BE] border-opacity-20">
            <div className="flex items-center">
              <FaClock className="text-[#B8C8D9] text-sm mr-3" />
              <span className="text-sm text-gray-600 font-medium">Duration</span>
            </div>
            <span className="text-sm font-semibold text-[#123458]">
              {internship.duration}
            </span>
          </div>

          {internship.stipend && (
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#f4f7fa] to-[#B8C8D9] bg-opacity-10 rounded-xl border border-[#B8C8D9] border-opacity-20">
              <div className="flex items-center">
                <FaDollarSign className="text-[#D4C9BE] text-sm mr-3" />
                <span className="text-sm text-gray-600 font-medium">Stipend</span>
              </div>
              <span className="text-sm font-semibold text-[#123458]">
                {internship.stipend}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link
          to={`/alumni/internships/${internship._id}`}
          className="group/btn relative w-full flex items-center justify-center py-3 px-6 bg-gradient-to-r from-[#123458] to-[#1e4a73] text-white font-semibold rounded-xl hover:from-[#1e4a73] hover:to-[#123458] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 overflow-hidden"
        >
          {/* Button Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#B8C8D9] to-[#D4C9BE] opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
          
          {/* Button Content */}
          <div className="relative flex items-center">
            <FaEye className="mr-2 text-sm group-hover/btn:scale-110 transition-transform duration-200" />
            <span>View Details</span>
          </div>
          
          {/* Button Shine Effect */}
          <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-20 group-hover/btn:animate-pulse"></div>
        </Link>
      </div>

      {/* Card Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#B8C8D9] via-transparent to-[#D4C9BE] opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default InternshipCard;
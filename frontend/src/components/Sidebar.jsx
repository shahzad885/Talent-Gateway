// First install react-icons: npm install react-icons

import React from "react";
import { Link } from "react-router-dom";
import { 
  FaHome, FaProjectDiagram, FaBriefcase, FaFileAlt, 
  FaClipboardCheck, FaPhoneAlt, FaBell, FaCommentAlt, 
  FaUserCircle, FaUsers, FaGraduationCap, FaChartLine,
  FaCode, FaBuilding, FaPaperPlane, FaCheckDouble,
  FaVideo, FaExclamationCircle, FaEnvelope, FaCog, FaHandshake
} from "react-icons/fa";

const Sidebar = ({
  activeTab,
  setActiveTab,
  notificationCount,
  unreadMessageCount,
}) => {
  const tabs = [
    { id: "overview", name: "Overview", icon: FaHome, sideIcon: FaChartLine },
    { id: "projects", name: "Projects", icon: FaProjectDiagram, sideIcon: FaCode },
    { id: "internships", name: "Internships", icon: FaBriefcase, sideIcon: FaBuilding },
    { id: "applications", name: "Applications", icon: FaFileAlt, sideIcon: FaPaperPlane },
    { id: "submissions", name: "Submissions", icon: FaClipboardCheck, sideIcon: FaCheckDouble },
    { id: "calls", name: "Calls", icon: FaPhoneAlt, sideIcon: FaVideo },
    {
      id: "notifications",
      name: "Notifications",
      icon: FaBell,
      sideIcon: FaExclamationCircle,
      count: notificationCount,
    },
    {
      id: "messages",
      name: "Messages",
      icon: FaCommentAlt,
      sideIcon: FaEnvelope,
      count: unreadMessageCount,
    },
    { id: "profile", name: "Profile", icon: FaUserCircle, sideIcon: FaCog },
    { id: "connections", name: "Connections", icon: FaUsers, sideIcon: FaHandshake },
  ];

  return (
    <div 
      className="w-72 h-screen fixed left-0 top-0 shadow-2xl overflow-y-auto"
      style={{ 
        background: 'linear-gradient(135deg, #f4f7fa 0%, #B8C8D9 100%)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Header Section with Enhanced Design */}
      <div 
        className="p-6 relative overflow-hidden"
        style={{ backgroundColor: '#123458' }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full transform translate-x-8 -translate-y-8" 
               style={{ backgroundColor: '#D4C9BE' }}></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full transform -translate-x-4 translate-y-4" 
               style={{ backgroundColor: '#B8C8D9' }}></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: '#D4C9BE' }}
            >
              <FaGraduationCap className="text-xl" style={{ color: '#123458' }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Alumni</h2>
              <p className="text-sm opacity-75" style={{ color: '#B8C8D9' }}>Portal Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="p-4 space-y-2">
        <div className="mb-6">
          <p 
            className="text-sm font-semibold uppercase tracking-wider px-3 mb-3"
            style={{ color: '#123458' }}
          >
            Navigation
          </p>
        </div>
        
        <ul className="space-y-1">
          {tabs.map((tab, index) => {
            const IconComponent = tab.icon;
            const SideIconComponent = tab.sideIcon;
            
            return (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center w-full px-4 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? "shadow-lg"
                      : "hover:shadow-md"
                  }`}
                  style={{
                    backgroundColor:
                      activeTab === tab.id ? '#123458' : 'rgba(255, 255, 255, 0.7)',
                    color: activeTab === tab.id ? 'white' : '#123458',
                    backdropFilter: 'blur(5px)',
                  }}
                >
                  {/* Active indicator - Right side icon only */}
                  {activeTab === tab.id && (
                    <div 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(212, 201, 190, 0.3)' }}
                    >
                      <SideIconComponent 
                        className="text-xs"
                        style={{ color: '#D4C9BE' }}
                      />
                    </div>
                  )}
                  
                  {/* Icon container */}
                  <div 
                    className={`flex items-center justify-center w-10 h-10 rounded-lg mr-4 transition-all duration-300 ${
                      activeTab === tab.id 
                        ? '' 
                        : 'group-hover:scale-110'
                    }`}
                    style={{
                      backgroundColor: 
                        activeTab === tab.id 
                          ? 'rgba(212, 201, 190, 0.2)' 
                          : 'rgba(18, 52, 88, 0.1)',
                    }}
                  >
                    <IconComponent 
                      className="text-lg"
                      style={{
                        color: activeTab === tab.id ? '#D4C9BE' : '#123458'
                      }}
                    />
                  </div>
                  
                  {/* Text */}
                  <span className="font-medium text-sm tracking-wide flex-1 text-left">
                    {tab.name}
                  </span>
                  
                  {/* Notification badges */}
                  {tab.count > 0 && (
                    <div className="relative ml-2">
                      <span 
                        className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-full shadow-lg animate-pulse min-w-[20px]"
                        style={{ 
                          backgroundColor: '#D4C9BE',
                          color: '#123458'
                        }}
                      >
                        {tab.count > 99 ? '99+' : tab.count}
                      </span>
                      <div 
                        className="absolute inset-0 rounded-full opacity-50 animate-ping"
                        style={{ backgroundColor: '#D4C9BE' }}
                      ></div>
                    </div>
                  )}

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                       style={{ backgroundColor: '#123458' }}></div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-2"
           style={{ 
             background: 'linear-gradient(90deg, #123458 0%, #D4C9BE 50%, #B8C8D9 100%)'
           }}></div>
    </div>
  );
};

export default Sidebar;
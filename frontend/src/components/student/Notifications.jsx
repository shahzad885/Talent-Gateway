// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import api from "../../services/api";
// import {
//   FaBell,
//   FaProjectDiagram,
//   FaBriefcase,
//   FaEnvelope,
//   FaUser,
//   FaCheck,
// } from "react-icons/fa";

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState("all"); // all, unread, read

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await api.get("/student/notifications");
//       setNotifications(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       setError("Failed to load notifications. Please try again later.");
//       setLoading(false);
//     }
//   };

//   const markAsRead = async (notificationId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await api.put(`/student/notifications/${notificationId}/read`, {});

//       // Update the notification in our state
//       setNotifications(
//         notifications.map((notification) => {
//           if (notification._id === notificationId) {
//             return { ...notification, read: true };
//           }
//           return notification;
//         })
//       );
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//     }
//   };

//   const markAllAsRead = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const unreadNotifications = notifications.filter((n) => !n.read);

//       // Mark each notification as read
//       for (const notification of unreadNotifications) {
//         await api.put(`/student/notifications/${notification._id}/read`, {});
//       }

//       // Update all notifications in our state
//       setNotifications(
//         notifications.map((notification) => {
//           return { ...notification, read: true };
//         })
//       );
//     } catch (error) {
//       console.error("Error marking all notifications as read:", error);
//     }
//   };

//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case "project_update":
//       case "new_project":
//       case "project_submission":
//         return <FaProjectDiagram className="text-indigo-600" />;
//       case "internship_update":
//       case "new_internship":
//         return <FaBriefcase className="text-green-600" />;
//       case "message":
//         return <FaEnvelope className="text-blue-600" />;
//       case "application_update":
//       case "new_application":
//         return <FaUser className="text-purple-600" />;
//       default:
//         return <FaBell className="text-yellow-600" />;
//     }
//   };

//   const getNotificationLink = (notification) => {
//     const { type, relatedItem } = notification;

//     if (!relatedItem) return "#";

//     const { itemType, itemId } = relatedItem;

//     switch (itemType) {
//       case "Project":
//         return `/student/projects/${itemId}`;
//       case "Internship":
//         return `/student/internships/${itemId}`;
//       case "Application":
//         return `/student/applications`;
//       case "Chat":
//         return `/student/chats`;
//       case "ProjectSubmission":
//         return `/student/projects`;
//       default:
//         return "#";
//     }
//   };

//   const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleString();
//   };

//   // Filter notifications based on selected filter
//   const filteredNotifications = notifications.filter((notification) => {
//     if (filter === "unread") return !notification.read;
//     if (filter === "read") return notification.read;
//     return true; // all
//   });

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Notifications</h1>

//         <div className="flex space-x-4">
//           <div className="inline-flex rounded-md shadow-sm">
//             <button
//               onClick={() => setFilter("all")}
//               className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
//                 filter === "all"
//                   ? "bg-indigo-600 text-white"
//                   : "bg-white text-gray-700 hover:bg-gray-100"
//               }`}
//             >
//               All
//             </button>
//             <button
//               onClick={() => setFilter("unread")}
//               className={`px-4 py-2 text-sm font-medium ${
//                 filter === "unread"
//                   ? "bg-indigo-600 text-white"
//                   : "bg-white text-gray-700 hover:bg-gray-100"
//               }`}
//             >
//               Unread
//             </button>
//             <button
//               onClick={() => setFilter("read")}
//               className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
//                 filter === "read"
//                   ? "bg-indigo-600 text-white"
//                   : "bg-white text-gray-700 hover:bg-gray-100"
//               }`}
//             >
//               Read
//             </button>
//           </div>

//           <button
//             onClick={markAllAsRead}
//             className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
//             disabled={!notifications.some((n) => !n.read)}
//           >
//             <FaCheck className="mr-2" /> Mark All as Read
//           </button>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         {filteredNotifications.length === 0 ? (
//           <div className="flex flex-col items-center justify-center p-8">
//             <FaBell className="text-gray-400 text-5xl mb-2" />
//             <p className="text-gray-500">
//               No {filter !== "all" ? filter : ""} notifications
//             </p>
//           </div>
//         ) : (
//           <ul className="divide-y divide-gray-200">
//             {filteredNotifications.map((notification) => (
//               <li
//                 key={notification._id}
//                 className={`p-4 hover:bg-gray-50 ${
//                   !notification.read ? "bg-indigo-50" : ""
//                 }`}
//               >
//                 <Link
//                   to={getNotificationLink(notification)}
//                   className="flex"
//                   onClick={() =>
//                     !notification.read && markAsRead(notification._id)
//                   }
//                 >
//                   <div className="mr-4 mt-1">
//                     {getNotificationIcon(notification.type)}
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex justify-between">
//                       <h3 className="font-medium">{notification.title}</h3>
//                       <span className="text-sm text-gray-500">
//                         {formatTimestamp(notification.createdAt)}
//                       </span>
//                     </div>
//                     <p className="text-gray-600 mt-1">{notification.message}</p>
//                     {!notification.read && (
//                       <div className="mt-2">
//                         <button
//                           onClick={(e) => {
//                             e.preventDefault();
//                             markAsRead(notification._id);
//                           }}
//                           className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
//                         >
//                           <FaCheck className="mr-1" /> Mark as read
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Notifications;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  FaBell,
  FaProjectDiagram,
  FaBriefcase,
  FaEnvelope,
  FaUser,
  FaCheck,
  FaFilter,
} from "react-icons/fa";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unread, read

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/student/notifications");
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications. Please try again later.");
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(`/student/notifications/${notificationId}/read`, {});

      // Update the notification in our state
      setNotifications(
        notifications.map((notification) => {
          if (notification._id === notificationId) {
            return { ...notification, read: true };
          }
          return notification;
        })
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const unreadNotifications = notifications.filter((n) => !n.read);

      // Mark each notification as read
      for (const notification of unreadNotifications) {
        await api.put(`/student/notifications/${notification._id}/read`, {});
      }

      // Update all notifications in our state
      setNotifications(
        notifications.map((notification) => {
          return { ...notification, read: true };
        })
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "project_update":
      case "new_project":
      case "project_submission":
        return <FaProjectDiagram className="text-blue-600" />;
      case "internship_update":
      case "new_internship":
        return <FaBriefcase className="text-green-600" />;
      case "message":
        return <FaEnvelope className="text-purple-600" />;
      case "application_update":
      case "new_application":
        return <FaUser className="text-orange-600" />;
      default:
        return <FaBell className="text-gray-600" />;
    }
  };

  const getNotificationLink = (notification) => {
    const { type, relatedItem } = notification;

    if (!relatedItem) return "#";

    const { itemType, itemId } = relatedItem;

    switch (itemType) {
      case "Project":
        return `/student/projects/${itemId}`;
      case "Internship":
        return `/student/internships/${itemId}`;
      case "Application":
        return `/student/applications`;
      case "Chat":
        return `/student/chats`;
      case "ProjectSubmission":
        return `/student/projects`;
      default:
        return "#";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true; // all
  });

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#f4f7fa' }}
      >
        <div className="flex flex-col items-center space-y-4">
          <div 
            className="animate-spin rounded-full h-16 w-16 border-4 border-t-4"
            style={{ 
              borderColor: '#B8C8D9',
              borderTopColor: '#123458'
            }}
          ></div>
          <p className="text-gray-500 font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen p-6"
        style={{ backgroundColor: '#f4f7fa' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaBell className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div 
      className="min-h-screen p-6"
      style={{ backgroundColor: '#f4f7fa' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div 
                className="p-3 rounded-full shadow-md"
                style={{ backgroundColor: '#123458' }}
              >
                <FaBell className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
                <p className="text-gray-600 mt-1">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Filter Buttons */}
              {/* <div className="flex items-center space-x-1 p-1 rounded-lg shadow-sm" style={{ backgroundColor: '#B8C8D9' }}>
                <FaFilter className="text-gray-600 ml-2" />
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    filter === "all"
                      ? "text-white shadow-md"
                      : "text-gray-700 hover:bg-white hover:bg-opacity-50"
                  }`}
                  style={filter === "all" ? { backgroundColor: '#123458' } : {}}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    filter === "unread"
                      ? "text-white shadow-md"
                      : "text-gray-700 hover:bg-white hover:bg-opacity-50"
                  }`}
                  style={filter === "unread" ? { backgroundColor: '#123458' } : {}}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter("read")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    filter === "read"
                      ? "text-white shadow-md"
                      : "text-gray-700 hover:bg-white hover:bg-opacity-50"
                  }`}
                  style={filter === "read" ? { backgroundColor: '#123458' } : {}}
                >
                  Read ({notifications.length - unreadCount})
                </button>
              </div> */}

              {/* Mark All Read Button */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center justify-center px-6 py-2 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                  style={{ backgroundColor: '#123458' }}
                >
                  <FaCheck className="mr-2" /> 
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div 
                className="p-6 rounded-full mb-4"
                style={{ backgroundColor: '#D4C9BE' }}
              >
                <FaBell className="text-gray-500 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No {filter !== "all" ? filter : ""} notifications
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                {filter === "unread" 
                  ? "Great! You're all caught up with your notifications."
                  : filter === "read"
                  ? "No read notifications to display."
                  : "You don't have any notifications yet. We'll notify you when something important happens."
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification, index) => (
                <div
                  key={notification._id}
                  className={`group transition-all duration-200 hover:shadow-md ${
                    !notification.read 
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4"
                      : "hover:bg-gray-50"
                  }`}
                  style={!notification.read ? { borderLeftColor: '#123458' } : {}}
                >
                  <Link
                    to={getNotificationLink(notification)}
                    className="block p-6"
                    onClick={() =>
                      !notification.read && markAsRead(notification._id)
                    }
                  >
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div 
                        className="flex-shrink-0 p-3 rounded-full shadow-sm"
                        style={{ backgroundColor: '#D4C9BE' }}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                              {notification.title}
                              {!notification.read && (
                                <span 
                                  className="inline-block w-2 h-2 rounded-full ml-2"
                                  style={{ backgroundColor: '#123458' }}
                                ></span>
                              )}
                            </h3>
                            <p className="text-gray-600 mt-1 leading-relaxed">
                              {notification.message}
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2 ml-4">
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                              {formatTimestamp(notification.createdAt)}
                            </span>
                            
                            {/* {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  markAsRead(notification._id);
                                }}
                                className="text-xs font-medium px-3 py-1 rounded-full text-white transition-all hover:shadow-md transform hover:scale-105"
                                style={{ backgroundColor: '#123458' }}
                              >
                                <FaCheck className="inline mr-1" /> Mark as read
                              </button>
                            )} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {notifications.length > 0 && (
          <div className="mt-6 text-center">
            <div 
              className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium text-gray-700 shadow-sm"
              style={{ backgroundColor: '#D4C9BE' }}
            >
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
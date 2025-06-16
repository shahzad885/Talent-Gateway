// // src/components/NotificationList.jsx
// import React from "react";

// const NotificationList = ({ notifications, onNotificationClick }) => {
//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case "application":
//         return "fas fa-file-alt";
//       case "submission":
//         return "fas fa-clipboard-check";
//       case "message":
//         return "fas fa-comment-alt";
//       case "project":
//         return "fas fa-project-diagram";
//       case "internship":
//         return "fas fa-briefcase";
//       default:
//         return "fas fa-bell";
//     }
//   };

//   const getNotificationColor = (type) => {
//     switch (type) {
//       case "application":
//         return "bg-blue-100 text-blue-800";
//       case "submission":
//         return "bg-purple-100 text-purple-800";
//       case "message":
//         return "bg-green-100 text-green-800";
//       case "project":
//         return "bg-yellow-100 text-yellow-800";
//       case "internship":
//         return "bg-orange-100 text-orange-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     const now = new Date();

//     // If today, show time
//     if (date.toDateString() === now.toDateString()) {
//       return date.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     }

//     // If this year, show month and day
//     if (date.getFullYear() === now.getFullYear()) {
//       return date.toLocaleDateString([], { month: "short", day: "numeric" });
//     }

//     // Otherwise show date
//     return date.toLocaleDateString();
//   };

//   return (
//     <div className="space-y-2">
//       {notifications.map((notification) => (
//         <div
//           key={notification._id}
//           onClick={() => onNotificationClick(notification._id)}
//           className={`p-3 border rounded cursor-pointer transition-colors ${
//             notification.read ? "bg-white" : "bg-blue-50"
//           } hover:bg-gray-50`}
//         >
//           <div className="flex items-start">
//             <div
//               className={`w-8 h-8 rounded-full ${getNotificationColor(
//                 notification.type
//               )} flex items-center justify-center mr-3`}
//             >
//               <i
//                 className={`${getNotificationIcon(notification.type)} text-sm`}
//               ></i>
//             </div>
//             <div className="flex-grow">
//               <div className={`${!notification.read ? "font-medium" : ""}`}>
//                 {notification.message}
//               </div>
//               <div className="text-xs text-gray-500 mt-1">
//                 {formatTimestamp(notification.timestamp)}
//               </div>
//             </div>
//             {!notification.read && (
//               <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default NotificationList;



// src/components/NotificationList.jsx
import React from "react";

const NotificationList = ({ notifications, onNotificationClick }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "application":
        return "fas fa-file-alt";
      case "submission":
        return "fas fa-clipboard-check";
      case "message":
        return "fas fa-comment-alt";
      case "project":
        return "fas fa-project-diagram";
      case "internship":
        return "fas fa-briefcase";
      default:
        return "fas fa-bell";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "application":
        return "bg-[#B8C8D9] text-[#123458]";
      case "submission":
        return "bg-[#D4C9BE] text-[#123458]";
      case "message":
        return "bg-[#f4f7fa] text-[#123458] border border-[#B8C8D9]";
      case "project":
        return "bg-[#B8C8D9]/70 text-[#123458]";
      case "internship":
        return "bg-[#D4C9BE]/70 text-[#123458]";
      default:
        return "bg-gray-100 text-[#123458]";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }

    // Otherwise show date
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification._id}
          onClick={() => onNotificationClick(notification._id)}
          className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 shadow-sm ${
            notification.read 
              ? "bg-white border-gray-200 hover:bg-[#f4f7fa]" 
              : "bg-[#f4f7fa] border-[#B8C8D9] hover:bg-white shadow-md"
          } hover:shadow-lg`}
        >
          <div className="flex items-start">
            <div
              className={`w-10 h-10 rounded-full ${getNotificationColor(
                notification.type
              )} flex items-center justify-center mr-4 flex-shrink-0 shadow-sm`}
            >
              <i
                className={`${getNotificationIcon(notification.type)} text-base`}
              ></i>
            </div>
            <div className="flex-grow min-w-0">
              <div className={`text-gray-800 leading-relaxed ${
                !notification.read ? "font-semibold" : "font-normal"
              }`}>
                {notification.message}
              </div>
              <div className="text-sm text-gray-500 mt-2 font-medium">
                {formatTimestamp(notification.timestamp)}
              </div>
            </div>
            {!notification.read && (
              <div className="w-3 h-3 rounded-full bg-[#123458] mt-1 flex-shrink-0 shadow-sm"></div>
            )}
          </div>
        </div>
      ))}
      
      {notifications.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-[#f4f7fa] border-2 border-[#B8C8D9] flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-bell-slash text-[#B8C8D9] text-xl"></i>
          </div>
          <p className="text-gray-500 font-medium">No notifications yet</p>
          <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
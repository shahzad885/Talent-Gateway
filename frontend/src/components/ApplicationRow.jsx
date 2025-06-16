// // src/components/ApplicationRow.jsx
// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// const ApplicationRow = ({ application, onAction, showStatus = false }) => {
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//   const [feedback, setFeedback] = useState("");
//   const [action, setAction] = useState("");

//   const handleSubmitFeedback = () => {
//     onAction(application._id, action, feedback);
//     setShowFeedbackModal(false);
//     setFeedback("");
//   };

//   const showFeedbackDialog = (actionType) => {
//     setAction(actionType);
//     setShowFeedbackModal(true);
//   };

//   const getOpportunityType = () => {
//     if (application.project) return "Project";
//     if (application.internship) return "Internship";
//     return "Unknown";
//   };

//   const getOpportunityTitle = () => {
//     if (application.project) return application.project.title;
//     if (application.internship) return application.internship.title;
//     return "";
//   };

//   const getOpportunityLink = () => {
//     if (application.project)
//       return `/alumni/projects/${application.project._id}`;
//     if (application.internship)
//       return `/alumni/internships/${application.internship._id}`;
//     return "#";
//   };

//   return (
//     <tr>
//       <td className="py-2 px-4 border-b">
//         <Link
//           to={`/alumni/students/${application.student._id}`}
//           className="text-blue-600 hover:underline"
//         >
//           {application.student.name}
//         </Link>
//       </td>
//       <td className="py-2 px-4 border-b">
//         <Link
//           to={getOpportunityLink()}
//           className="text-blue-600 hover:underline"
//         >
//           {getOpportunityTitle()}
//         </Link>
//       </td>
//       <td className="py-2 px-4 border-b">{getOpportunityType()}</td>
//       {showStatus && (
//         <td className="py-2 px-4 border-b">
//           <span
//             className={`px-2 py-1 rounded-full text-xs font-medium ${
//               application.status === "Pending"
//                 ? "bg-yellow-100 text-yellow-800"
//                 : application.status === "Accepted"
//                 ? "bg-green-100 text-green-800"
//                 : "bg-red-100 text-red-800"
//             }`}
//           >
//             {application.status}
//           </span>
//         </td>
//       )}
//       <td className="py-2 px-4 border-b">
//         {new Date(application.appliedDate).toLocaleDateString()}
//       </td>
//       <td className="py-2 px-4 border-b">
//         <div className="flex space-x-2">
//           <Link
//             to={`/alumni/applications/${application._id}`}
//             className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
//           >
//             View
//           </Link>
//           {application.status === "Pending" && (
//             <>
//               <button
//                 onClick={() => showFeedbackDialog("Accepted")}
//                 className="px-3 py-1 bg-green-500 text-white rounded text-sm"
//               >
//                 Accept
//               </button>
//               <button
//                 onClick={() => showFeedbackDialog("Rejected")}
//                 className="px-3 py-1 bg-red-500 text-white rounded text-sm"
//               >
//                 Reject
//               </button>
//             </>
//           )}
//         </div>
//       </td>

//       {/* Feedback Modal */}
//       {showFeedbackModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-4">
//               {action === "Accepted"
//                 ? "Accept Application"
//                 : "Reject Application"}
//             </h3>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Feedback (Optional)
//               </label>
//               <textarea
//                 value={feedback}
//                 onChange={(e) => setFeedback(e.target.value)}
//                 placeholder="Enter feedback for the student..."
//                 className="w-full border rounded px-3 py-2 h-24"
//               ></textarea>
//             </div>
//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={() => setShowFeedbackModal(false)}
//                 className="px-4 py-2 border text-gray-700 rounded hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmitFeedback}
//                 className={`px-4 py-2 text-white rounded ${
//                   action === "Accepted"
//                     ? "bg-green-600 hover:bg-green-700"
//                     : "bg-red-600 hover:bg-red-700"
//                 }`}
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </tr>
//   );
// };

// export default ApplicationRow;



// src/components/ApplicationRow.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const ApplicationRow = ({ application, onAction, showStatus = false }) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [action, setAction] = useState("");

  const handleSubmitFeedback = () => {
    onAction(application._id, action, feedback);
    setShowFeedbackModal(false);
    setFeedback("");
  };

  const showFeedbackDialog = (actionType) => {
    setAction(actionType);
    setShowFeedbackModal(true);
  };

  const getOpportunityType = () => {
    if (application.project) return "Project";
    if (application.internship) return "Internship";
    return "Unknown";
  };

  const getOpportunityTitle = () => {
    if (application.project) return application.project.title;
    if (application.internship) return application.internship.title;
    return "";
  };

  const getOpportunityLink = () => {
    if (application.project)
      return `/alumni/projects/${application.project._id}`;
    if (application.internship)
      return `/alumni/internships/${application.internship._id}`;
    return "#";
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-2 px-4 border-b border-gray-200">
        <Link
          to={`/alumni/students/${application.student._id}`}
          className="text-[#123458] hover:underline font-medium"
        >
          {application.student.name}
        </Link>
      </td>
      <td className="py-2 px-4 border-b border-gray-200">
        <Link
          to={getOpportunityLink()}
          className="text-[#123458] hover:underline font-medium"
        >
          {getOpportunityTitle()}
        </Link>
      </td>
      <td className="py-2 px-4 border-b border-gray-200 text-gray-700">
        {getOpportunityType()}
      </td>
      {showStatus && (
        <td className="py-2 px-4 border-b border-gray-200">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              application.status === "Pending"
                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                : application.status === "Accepted"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {application.status}
          </span>
        </td>
      )}
      <td className="py-2 px-4 border-b border-gray-200 text-gray-600">
        {new Date(application.appliedDate).toLocaleDateString()}
      </td>
      <td className="py-2 px-4 border-b border-gray-200">
        <div className="flex space-x-2">
          <Link
            to={`/alumni/applications/${application._id}`}
            className="px-3 py-1 bg-[#B8C8D9] text-[#123458] rounded text-sm font-medium hover:bg-[#a5b7cc] transition-colors"
          >
            View
          </Link>
          {application.status === "Pending" && (
            <>
              <button
                onClick={() => showFeedbackDialog("Accepted")}
                className="px-3 py-1 bg-[#123458] text-white rounded text-sm font-medium hover:bg-[#0f2a47] transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => showFeedbackDialog("Rejected")}
                className="px-3 py-1 bg-[#D4C9BE] text-[#123458] rounded text-sm font-medium hover:bg-[#c7b8a8] transition-colors border border-[#123458]/20"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </td>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-[#123458]">
              {action === "Accepted"
                ? "Accept Application"
                : "Reject Application"}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter feedback for the student..."
                className="w-full border border-[#B8C8D9] rounded-md px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-[#123458] focus:border-[#123458] resize-none"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 border border-[#B8C8D9] text-gray-700 rounded-md hover:bg-[#f4f7fa] transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className={`px-4 py-2 text-white rounded-md font-medium transition-colors ${
                  action === "Accepted"
                    ? "bg-[#123458] hover:bg-[#0f2a47]"
                    : "bg-[#D4C9BE] text-[#123458] hover:bg-[#c7b8a8] border border-[#123458]/20"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </tr>
  );
};

export default ApplicationRow;
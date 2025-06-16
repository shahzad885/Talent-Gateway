import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { FaSpinner, FaExclamationCircle, FaFolderOpen } from "react-icons/fa";

const StatusChip = ({ text, color }) => (
  <span
    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${color}`}
  >
    {text}
  </span>
);

const ApprovedProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, submissionsRes] = await Promise.all([
          api.get("/student/approved-projects"),
          api.get("/student/submissions"),
        ]);

        setProjects(projectsRes.data);
        setSubmissions(submissionsRes.data); // [{ project: 'id', status: 'Submitted' }]
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmitProject = (projectId) => {
    navigate(`/student/projects/submissions/${projectId}`);
  };

  const getSubmissionStatus = (projectId) =>
    submissions.find((s) => s.project === projectId);

  const statusColorMap = {
    Submitted: "bg-yellow-200 text-yellow-800",
    Reviewed: "bg-blue-200 text-blue-800",
    Accepted: "bg-green-200 text-green-800",
    Rejected: "bg-red-200 text-red-800",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Approved Projects
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded flex items-center">
          <FaExclamationCircle className="mr-2" />
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-10">
          <FaFolderOpen className="text-5xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            No approved projects found. Apply to projects to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => {
            const submission = getSubmissionStatus(project._id);
            return (
              <div
                key={project._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {project.title}
                  </h2>
                  <div className="space-x-2">
                    {submission && (
                      <>
                        <StatusChip
                          text={submission.status}
                          color={statusColorMap[submission.status]}
                        />
                      </>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{project.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="font-medium text-gray-700">Skills:</span>{" "}
                    {project.skills.join(", ")}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>{" "}
                    {project.duration}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Deadline:</span>{" "}
                    {new Date(project.deadline).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Alumni:</span>{" "}
                    {project.alumni.name}
                  </div>
                </div>
                <button
                  onClick={() => handleSubmitProject(project._id)}
                  className="bg-indigo-700 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors"
                >
                  Submit Project
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApprovedProjects;

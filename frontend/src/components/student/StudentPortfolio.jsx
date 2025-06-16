import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api"; // Adjust the import based on your project structure
import {
  FaGithub,
  FaExternalLinkAlt,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

const StudentPortfolio = ({ user }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingBio, setEditingBio] = useState(false);

  // Form states
  const [bio, setBio] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  // Project form state
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    skills: [],
    demoLink: "",
    githubLink: "",
    startDate: "",
    endDate: "",
    isPublic: true,
  });

  useEffect(() => {
    fetchPortfolio();
  }, [user]);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.get("/student/portfolio");

      setPortfolio(response.data);

      // Initialize form states with existing data
      setBio(response.data.bio || "");
      setResumeUrl(response.data.resumeUrl || "");
      setIsPublic(response.data.isPublic !== false);

      // Set social links
      if (response.data.socialLinks) {
        setLinkedin(response.data.socialLinks.linkedin || "");
        setGithub(response.data.socialLinks.github || "");
        setWebsite(response.data.socialLinks.website || "");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      setError("Failed to load portfolio. Please try again.");
      setLoading(false);
    }
  };

  const handleBioSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const socialLinks = {
        linkedin,
        github,
        website,
      };

      await api.put("/student/portfolio", {
        bio,
        resumeUrl,
        socialLinks,
        isPublic,
      });

      setEditingBio(false);
      fetchPortfolio();
    } catch (err) {
      console.error("Error updating portfolio:", err);
      setError("Failed to update portfolio. Please try again.");
    }
  };

  const handleProjectFormChange = (e) => {
    const { name, value } = e.target;
    setProjectForm({
      ...projectForm,
      [name]: value,
    });
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setProjectForm({
      ...projectForm,
      skills,
    });
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.post("/student/portfolio/projects", projectForm);

      // Reset form and hide it
      setProjectForm({
        title: "",
        description: "",
        skills: [],
        demoLink: "",
        githubLink: "",
        startDate: "",
        endDate: "",
        isPublic: true,
      });
      setShowAddProject(false);
      fetchPortfolio();
    } catch (err) {
      console.error("Error adding project:", err);
      setError("Failed to add project. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading portfolio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
        role="alert"
      >
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Portfolio</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {portfolio?.isPublic ? "Public" : "Private"} Portfolio
          </span>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">About Me</h2>
          {!editingBio ? (
            <button
              onClick={() => setEditingBio(true)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              <FaEdit className="text-lg" />
            </button>
          ) : null}
        </div>

        {editingBio ? (
          <form onSubmit={handleBioSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows="4"
                placeholder="Tell us about yourself, your skills, and interests..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume URL
              </label>
              <input
                type="text"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="LinkedIn profile URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub
                </label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="GitHub profile URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Website
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Your website URL"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">
                Make portfolio public
              </label>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingBio(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700">
              {portfolio?.bio || "No bio available. Click edit to add a bio."}
            </p>

            {portfolio?.resumeUrl && (
              <div>
                <a
                  href={portfolio.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <FaExternalLinkAlt className="mr-2" /> View Resume
                </a>
              </div>
            )}

            <div className="flex space-x-4">
              {portfolio?.socialLinks?.linkedin && (
                <a
                  href={portfolio.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  LinkedIn
                </a>
              )}
              {portfolio?.socialLinks?.github && (
                <a
                  href={portfolio.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  GitHub
                </a>
              )}
              {portfolio?.socialLinks?.website && (
                <a
                  href={portfolio.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Website
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Projects</h2>
          <button
            onClick={() => setShowAddProject(!showAddProject)}
            className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 flex items-center"
          >
            <FaPlus className="mr-1" /> Add Project
          </button>
        </div>

        {showAddProject && (
          <div className="mb-6 p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium mb-3">Add New Project</h3>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={projectForm.title}
                    onChange={handleProjectFormChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={projectForm.skills.join(", ")}
                    onChange={handleSkillsChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="React, Node.js, MongoDB, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={projectForm.description}
                  onChange={handleProjectFormChange}
                  className="w-full p-2 border rounded-md"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Demo Link
                  </label>
                  <input
                    type="text"
                    name="demoLink"
                    value={projectForm.demoLink}
                    onChange={handleProjectFormChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub Link
                  </label>
                  <input
                    type="text"
                    name="githubLink"
                    value={projectForm.githubLink}
                    onChange={handleProjectFormChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={projectForm.startDate}
                    onChange={handleProjectFormChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={projectForm.endDate}
                    onChange={handleProjectFormChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="projectIsPublic"
                  name="isPublic"
                  checked={projectForm.isPublic}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      isPublic: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="projectIsPublic"
                  className="text-sm text-gray-700"
                >
                  Make project visible in public portfolio
                </label>
              </div>

              <div className="flex space-x-2">
  <button
    type="submit"
    className="px-4 py-2 rounded-md text-white transition-colors duration-200"
    style={{ 
      backgroundColor: '#123458',
      '&:hover': { backgroundColor: '#0f2a47' }
    }}
    onMouseEnter={(e) => e.target.style.backgroundColor = '#0f2a47'}
    onMouseLeave={(e) => e.target.style.backgroundColor = '#123458'}
  >
    Add Project
  </button>
  <button
    type="button"
    onClick={() => setShowAddProject(false)}
    className="px-4 py-2 rounded-md transition-colors duration-200"
    style={{ 
      backgroundColor: '#B8C8D9',
      color: '#123458'
    }}
    onMouseEnter={(e) => e.target.style.backgroundColor = '#a5b7ca'}
    onMouseLeave={(e) => e.target.style.backgroundColor = '#B8C8D9'}
  >
    Cancel
  </button>
</div>
            </form>
          </div>
        )}

        {portfolio?.projects?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No projects added yet. Add projects to showcase your work.
          </div>
        ) : (
          <div className="space-y-6">
            {portfolio?.projects?.map((project, index) => (
              <div
                key={index}
                className="border-b pb-6 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium">{project.title}</h3>
                  <div className="flex space-x-2">
                    {!project.isPublic && (
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                        Private
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 mt-2">{project.description}</p>

                {project.skills && project.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  {project.startDate && (
                    <div className="text-gray-600">
                      {new Date(project.startDate).toLocaleDateString()}
                      {project.endDate
                        ? ` - ${new Date(project.endDate).toLocaleDateString()}`
                        : " - Present"}
                    </div>
                  )}

                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                      <FaGithub className="mr-1" /> GitHub
                    </a>
                  )}

                  {project.demoLink && (
                    <a
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                      <FaExternalLinkAlt className="mr-1" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPortfolio;

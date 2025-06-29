import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../hooks/apiClient";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({
    projectName: "",
    description: "",
    targetAmount: 0,
    raisedAmount: 0,
    governate: "",
    city: "",
    childern: 0,
    adults: 0,
    old: 0,
    chronicPatient: 0,
    weakAmmunity: 0,
    male: 0,
    female: 0,
    totalBeneficiaries: 0,
    vaccineType: "",
    status: ""
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    projectName: "",
    description: "",
    targetAmount: 0,
    raisedAmount: 0,
    governate: "",
    city: "",
    childern: 0,
    adults: 0,
    old: 0,
    chronicPatient: 0,
    weakAmmunity: 0,
    male: 0,
    female: 0,
    totalBeneficiaries: 0,
    vaccineType: "",
    status: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await apiClient.get("/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects(response.data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.message);
      showNotification("error", "Failed to load projects");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchProjects();
  }, [navigate]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setEditForm({
      projectName: project.projectName || "",
      description: project.description || "",
      targetAmount: project.targetAmount || 0,
      raisedAmount: project.raisedAmount || 0,
      governate: project.governate || "",
      city: project.city || "",
      childern: project.childern || 0,
      adults: project.adults || 0,
      old: project.old || 0,
      chronicPatient: project.chronicPatient || 0,
      weakAmmunity: project.weakAmmunity || 0,
      male: project.male || 0,
      female: project.female || 0,
      totalBeneficiaries: project.totalBeneficiaries || 0,
      vaccineType: project.vaccineType || "",
      status: project.status || ""
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      await apiClient.put(
        `/projects/${editingProject.id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showNotification("success", "Project updated successfully");
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      console.error("Error updating project:", err);
      showNotification("error", "Failed to update project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const token = localStorage.getItem("authToken");
        await apiClient.delete(`/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        showNotification("success", "Project deleted successfully");
        fetchProjects();
      } catch (err) {
        console.error("Error deleting project:", err);
        showNotification("error", "Failed to delete project");
      }
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      await apiClient.post(
        "/projects",
        createForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showNotification("success", "Project created successfully");
      setShowCreateForm(false);
      setCreateForm({
        projectName: "",
        description: "",
        targetAmount: 0,
        raisedAmount: 0,
        governate: "",
        city: "",
        childern: 0,
        adults: 0,
        old: 0,
        chronicPatient: 0,
        weakAmmunity: 0,
        male: 0,
        female: 0,
        totalBeneficiaries: 0,
        vaccineType: "",
        status: ""
      });
      fetchProjects();
    } catch (err) {
      console.error("Error creating project:", err);
      showNotification(
        "error",
        err.response?.data?.message || "Failed to create project"
      );
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredProjects = Array.isArray(projects)
    ? projects.filter(project =>
        project?.projectName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <div className="container mx-auto p-4">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md ${
            notification.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {notification.message}
          <button
            onClick={() => setNotification(null)}
            className="ml-4 text-sm font-medium focus:outline-none"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Projects Management</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
          >
            <FiPlus className="mr-2" />
            Add Project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Governate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beneficiaries</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raised</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentProjects.length > 0 ? (
                    currentProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {project.projectName || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.governate || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.totalBeneficiaries?.toLocaleString() || "0"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.targetAmount?.toLocaleString() || "0"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.raisedAmount?.toLocaleString() || "0"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            project.status === 'active' ? 'bg-green-100 text-green-800' :
                            project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(project.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditClick(project)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchTerm ? "No projects match your search" : "No projects found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {filteredProjects.length > projectsPerPage && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      {/* Edit Project Modal */}
      <Modal isOpen={!!editingProject} onClose={() => setEditingProject(null)}>
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>
        <form onSubmit={handleEditSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                name="projectName"
                value={editForm.projectName}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Amount *
              </label>
              <input
                type="number"
                name="targetAmount"
                value={editForm.targetAmount}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raised Amount *
              </label>
              <input
                type="number"
                name="raisedAmount"
                value={editForm.raisedAmount}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Governate *
              </label>
              <input
                type="text"
                name="governate"
                value={editForm.governate}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={editForm.city}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Children *
              </label>
              <input
                type="number"
                name="childern"
                value={editForm.childern}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adults *
              </label>
              <input
                type="number"
                name="adults"
                value={editForm.adults}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Elderly *
              </label>
              <input
                type="number"
                name="old"
                value={editForm.old}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chronic Patients *
              </label>
              <input
                type="number"
                name="chronicPatient"
                value={editForm.chronicPatient}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weak Immunity *
              </label>
              <input
                type="number"
                name="weakAmmunity"
                value={editForm.weakAmmunity}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Male *
              </label>
              <input
                type="number"
                name="male"
                value={editForm.male}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Female *
              </label>
              <input
                type="number"
                name="female"
                value={editForm.female}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Beneficiaries *
              </label>
              <input
                type="number"
                name="totalBeneficiaries"
                value={editForm.totalBeneficiaries}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vaccine Type *
              </label>
              <input
                type="text"
                name="vaccineType"
                value={editForm.vaccineType}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                className="w-full px-3 py-2 focus:outline-none resize-none"
                rows="4"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => setEditingProject(null)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Project Modal */}
      <Modal isOpen={showCreateForm} onClose={() => setShowCreateForm(false)}>
        <h2 className="text-xl font-bold mb-4">Add New Project</h2>
        <form onSubmit={handleCreateSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                name="projectName"
                value={createForm.projectName}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Amount *
              </label>
              <input
                type="number"
                name="targetAmount"
                value={createForm.targetAmount}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raised Amount *
              </label>
              <input
                type="number"
                name="raisedAmount"
                value={createForm.raisedAmount}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Governate *
              </label>
              <input
                type="text"
                name="governate"
                value={createForm.governate}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={createForm.city}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Children *
              </label>
              <input
                type="number"
                name="childern"
                value={createForm.childern}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adults *
              </label>
              <input
                type="number"
                name="adults"
                value={createForm.adults}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Elderly *
              </label>
              <input
                type="number"
                name="old"
                value={createForm.old}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chronic Patients *
              </label>
              <input
                type="number"
                name="chronicPatient"
                value={createForm.chronicPatient}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weak Immunity *
              </label>
              <input
                type="number"
                name="weakAmmunity"
                value={createForm.weakAmmunity}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Male *
              </label>
              <input
                type="number"
                name="male"
                value={createForm.male}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Female *
              </label>
              <input
                type="number"
                name="female"
                value={createForm.female}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Beneficiaries *
              </label>
              <input
                type="number"
                name="totalBeneficiaries"
                value={createForm.totalBeneficiaries}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vaccine Type *
              </label>
              <input
                type="text"
                name="vaccineType"
                value={createForm.vaccineType}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                name="status"
                value={createForm.status}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
              <textarea
                name="description"
                value={createForm.description}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 focus:outline-none resize-none"
                rows="4"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
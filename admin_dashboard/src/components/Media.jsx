import React, { useState, useEffect } from "react";
import {
  FiTrash2,
  FiPlus,
  FiUpload,
  FiImage,
  FiLink,
  FiSearch,
  FiX,
} from "react-icons/fi";
import apiClient from "../hooks/apiClient";
import Modal from "../components/Modal";
import { useParams } from "react-router-dom";

const ProjectMediaPartners = () => {
  const { projectId } = useParams();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(projectId || "");
  const [media, setMedia] = useState([]);
  const [partners, setPartners] = useState([]);
  const [allPartners, setAllPartners] = useState([]);
  const [loading, setLoading] = useState({
    projects: true,
    media: true,
    partners: true,
    allPartners: true,
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [newMedia, setNewMedia] = useState({
    file: null,
    media_type: "1", // Default to image type
  });
  const [selectedPartner, setSelectedPartner] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("media");
  const [uploading, setUploading] = useState(false);

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await apiClient.get("/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(Array.isArray(res?.data) ? res.data : []);
        if (!projectId && res.data?.length > 0) {
          setSelectedProject(res.data[0].id.toString());
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]);
      } finally {
        setLoading((prev) => ({ ...prev, projects: false }));
      }
    };

    fetchProjects();
  }, [projectId]);

  // Fetch media and partners when project changes
  useEffect(() => {
    if (!selectedProject) return;

    const fetchProjectData = async () => {
      try {
        setLoading((prev) => ({ ...prev, media: true, partners: true }));
        const token = localStorage.getItem("authToken");

        const [mediaRes, partnersRes] = await Promise.all([
          apiClient.get(`/api/project-media/project/${selectedProject}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          apiClient.get(`/api/project-partners/project/${selectedProject}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log("Media response:", mediaRes?.data);
        console.log("Partners response:", partnersRes?.data);

        // Handle media response - matches your backend response structure
        if (mediaRes?.data?.success && Array.isArray(mediaRes.data.media)) {
          setMedia(
            mediaRes.data.media.map((path) => ({
              path,
              filename: path.split("/").pop(),
              media_type: "1", // Assuming all are images as per your requirement
            }))
          );
        } else {
          setMedia([]);
        }

        // Handle partners response
        if (
          partnersRes?.data?.success &&
          Array.isArray(partnersRes.data.partners)
        ) {
          setPartners(partnersRes.data.partners);
        } else {
          setPartners([]);
        }
      } catch (err) {
        console.error("Error fetching project data:", err);
        setMedia([]);
        setPartners([]);
      } finally {
        setLoading((prev) => ({ ...prev, media: false, partners: false }));
      }
    };

    fetchProjectData();
  }, [selectedProject]);

  // Fetch all available partners
  useEffect(() => {
    const fetchAllPartners = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await apiClient.get("/api/partners", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("All partners response:", res?.data);
        setAllPartners(
          Array.isArray(res?.data?.partners) ? res.data.partners : []
        );
      } catch (err) {
        console.error("Error fetching partners:", err);
        setAllPartners([]);
      } finally {
        setLoading((prev) => ({ ...prev, allPartners: false }));
      }
    };

    fetchAllPartners();
  }, []);

  // Handle media upload - Updated to match your backend API
  const handleMediaUpload = async (e) => {
    e.preventDefault();
    if (!newMedia.file) {
      alert("Please select an image file to upload");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("project_id", selectedProject);
    formData.append("media_type", newMedia.media_type);
    formData.append("media", newMedia.file); // Changed to "media" to match your route

    try {
      const token = localStorage.getItem("authToken");
      const res = await apiClient.post("/api/project-media", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", res.data);

      if (res.data?.success && res.data.mediaRecords?.[0]?.media_url) {
        // Add the new media item to state
        const newMediaItem = {
          path: res.data.mediaRecords[0].media_url,
          filename: newMedia.file.name,
          media_type: newMedia.media_type,
        };
        setMedia((prev) => [...prev, newMediaItem]);

        setShowUploadModal(false);
        setNewMedia({ file: null, media_type: "1" });
        alert("Image uploaded successfully!");
      } else {
        throw new Error(
          res.data?.message || "Image uploaded but no URL returned"
        );
      }
    } catch (err) {
      console.error("Error uploading media:", {
        error: err,
        response: err.response?.data,
      });
      alert(
        `Failed to upload image: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setUploading(false);
    }
  };

  // Handle partner association
  const handleAddPartner = async (e) => {
    e.preventDefault();
    if (!selectedPartner) return;

    try {
      const token = localStorage.getItem("authToken");
      await apiClient.post(
        "/api/project-partners",
        {
          project_id: selectedProject,
          partner_id: selectedPartner,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const addedPartner = allPartners.find(
        (p) => p.id.toString() === selectedPartner
      );

      if (addedPartner) {
        setPartners((prev) => [...prev, addedPartner]);
      }

      setShowPartnerModal(false);
      setSelectedPartner("");
    } catch (err) {
      console.error("Error adding partner:", err.response?.data || err.message);
      alert("Failed to add partner. Please try again.");
    }
  };

  // Handle deletion
  // Handle deletion - Updated version
  const handleDelete = async (type, idOrIndex) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      if (type === "media") {
        // For media, we need to get the actual ID from the media array
        const mediaItem = media[idOrIndex];
        if (!mediaItem) {
          throw new Error("Media item not found");
        }

        // Extract the ID from the path (assuming path is like "/projectMedia/123-filename.jpg")
        const pathParts = mediaItem.path.split("/");
        const filename = pathParts[pathParts.length - 1];
        const fileId = filename.split("-")[0]; // Get the ID part before the hyphen

        if (!fileId) {
          throw new Error("Could not extract media ID from path");
        }

        // Delete from backend
        await apiClient.delete(`/api/project-media/${fileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Delete from state
        setMedia((prev) => prev.filter((_, index) => index !== idOrIndex));
      } else {
        // For partners, we can use the ID directly
        await apiClient.delete(`/api/project-partners/${idOrIndex}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPartners((prev) =>
          prev.filter((partner) => partner.id !== idOrIndex)
        );
      }

      alert(`${type} deleted successfully!`);
    } catch (err) {
      console.error("Error deleting:", {
        error: err,
        response: err.response?.data,
      });
      alert(
        `Failed to delete ${type}: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  // Filter items based on search
  const filteredItems =
    activeTab === "media"
      ? media.filter((item) =>
          (item.filename || "").toLowerCase().includes(searchTerm.toLowerCase())
        )
      : partners.filter(
          (partner) =>
            partner.partner_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (partner.partner_url || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );

  const isLoading =
    loading.projects ||
    loading.media ||
    loading.partners ||
    loading.allPartners;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Project Resources
            </h1>
            <p className="text-gray-600 mt-2">
              Manage media and partners for your projects
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                disabled={loading.projects}
              >
                {loading.projects ? (
                  <option>Loading projects...</option>
                ) : (
                  <>
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id.toString()}>
                        {project.projectName} (ID: {project.id})
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedProject}
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        {selectedProject && (
          <>
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`py-3 px-6 font-medium text-sm rounded-t-lg ${
                  activeTab === "media"
                    ? "bg-white border-t border-l border-r border-gray-200 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("media")}
              >
                Media
              </button>
              <button
                className={`py-3 px-6 font-medium text-sm rounded-t-lg ${
                  activeTab === "partners"
                    ? "bg-white border-t border-l border-r border-gray-200 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("partners")}
              >
                Partners
              </button>
            </div>

            {/* Add New Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() =>
                  activeTab === "media"
                    ? setShowUploadModal(true)
                    : setShowPartnerModal(true)
                }
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!selectedProject}
              >
                <FiPlus className="mr-2" />
                Add {activeTab === "media" ? "Media" : "Partner"}
              </button>
            </div>
          </>
        )}

        {/* Content */}
        {!selectedProject ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">
              Please select a project to view or manage resources
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                >
                  {/* Delete Button */}
                  <div className="flex justify-end p-2">
                    <button
                      onClick={() => handleDelete("media", item.id || index)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  {/* Item Content */}
                  <div className="p-4 pt-0">
                    {activeTab === "media" ? (
                      <>
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                          <img
                            src={`${apiClient.defaults.baseURL}${item.path}`}
                            alt={item.filename}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';
                            }}
                          />
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <FiImage className="mr-2" />
                          Image
                        </div>
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.filename}
                        </h3>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-center mb-3">
                          <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                            {item.partner_logo ? (
                              <img
                                src={`${apiClient.defaults.baseURL}${item.partner_logo}`}
                                alt={item.partner_name}
                                className="object-contain w-full h-full p-2"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';
                                }}
                              />
                            ) : (
                              <FiLink size={24} className="text-gray-400" />
                            )}
                          </div>
                        </div>
                        <h3 className="font-medium text-gray-900 text-center">
                          {item.partner_name}
                        </h3>
                        {item.partner_url && (
                          <a
                            href={item.partner_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline block text-center truncate"
                          >
                            {item.partner_url.replace(/^https?:\/\//, "")}
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-gray-500">
                  No {activeTab} found for this project.{" "}
                  {searchTerm && "Try a different search term."}
                </p>
                <button
                  onClick={() =>
                    activeTab === "media"
                      ? setShowUploadModal(true)
                      : setShowPartnerModal(true)
                  }
                  className="mt-4 flex items-center justify-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiPlus className="mr-2" />
                  Add Your First {activeTab === "media" ? "Media" : "Partner"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload Media Modal */}
      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Upload Image to Project</h2>
            <button
              onClick={() => setShowUploadModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>
          <form onSubmit={handleMediaUpload}>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Project:{" "}
                <strong>
                  {projects.find((p) => p.id.toString() === selectedProject)
                    ?.projectName || selectedProject}
                </strong>
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image File (Max 100MB)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                {newMedia.file ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(newMedia.file)}
                      alt="Preview"
                      className="mx-auto max-h-48 rounded-lg mb-2"
                    />
                    <p className="text-sm text-gray-600 truncate">
                      {newMedia.file.name} (
                      {Math.round(newMedia.file.size / 1024)} KB)
                    </p>
                    <button
                      type="button"
                      onClick={() => setNewMedia({ ...newMedia, file: null })}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <div className="flex justify-center text-sm text-gray-600">
                      <label className="relative cursor-pointer">
                        <span className="flex items-center px-3 py-2 bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <FiUpload className="mr-2" />
                          Select Image
                        </span>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              if (e.target.files[0].size > 100 * 1024 * 1024) {
                                alert("File size must be less than 100MB");
                                return;
                              }
                              setNewMedia({
                                ...newMedia,
                                file: e.target.files[0],
                              });
                            }
                          }}
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG up to 100MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newMedia.file || uploading}
                className={`px-4 py-2 rounded-md text-white ${
                  !newMedia.file || uploading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {uploading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  "Upload Image"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Add Partner Modal */}
      <Modal
        isOpen={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Add Partner to Project</h2>
            <button
              onClick={() => setShowPartnerModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>
          <form onSubmit={handleAddPartner}>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Project:{" "}
                <strong>
                  {projects.find((p) => p.id.toString() === selectedProject)
                    ?.projectName || selectedProject}
                </strong>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Partner *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={selectedPartner}
                onChange={(e) => setSelectedPartner(e.target.value)}
                required
              >
                <option value="">Select a partner</option>
                {Array.isArray(allPartners) &&
                  allPartners.map((partner) => (
                    <option key={partner.id} value={partner.id.toString()}>
                      {partner.partner_name}{" "}
                      {partner.partner_url &&
                        `(${partner.partner_url.replace(/^https?:\/\//, "")})`}
                    </option>
                  ))}
              </select>
            </div>

            {selectedPartner && (
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  {allPartners.find((p) => p.id.toString() === selectedPartner)
                    ?.partner_logo ? (
                    <img
                      src={`${apiClient.defaults.baseURL}${
                        allPartners.find(
                          (p) => p.id.toString() === selectedPartner
                        )?.partner_logo
                      }`}
                      alt="Partner logo"
                      className="w-12 h-12 rounded-full object-cover mr-3"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239ca3af"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <FiLink className="text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">
                      {
                        allPartners.find(
                          (p) => p.id.toString() === selectedPartner
                        )?.partner_name
                      }
                    </h4>
                    {allPartners.find(
                      (p) => p.id.toString() === selectedPartner
                    )?.partner_url && (
                      <a
                        href={
                          allPartners.find(
                            (p) => p.id.toString() === selectedPartner
                          )?.partner_url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {allPartners
                          .find((p) => p.id.toString() === selectedPartner)
                          ?.partner_url.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowPartnerModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedPartner}
                className={`px-4 py-2 rounded-md text-white ${
                  selectedPartner
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-400 cursor-not-allowed"
                }`}
              >
                Add Partner
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectMediaPartners;

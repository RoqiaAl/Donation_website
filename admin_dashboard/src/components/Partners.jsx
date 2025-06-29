import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../hooks/apiClient";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";

const Partners = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [editingPartner, setEditingPartner] = useState(null);
  const [editForm, setEditForm] = useState({
    partner_name: "",
    partner_url: "",
    partner_logo: null,
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    partner_name: "",
    partner_url: "",
    partner_logo: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const partnersPerPage = 6;

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await apiClient.get("/api/partners", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let partnersData = [];
      if (Array.isArray(response.data)) {
        partnersData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        partnersData = response.data.data;
      } else if (response.data && response.data.partners) {
        partnersData = response.data.partners;
      }

      setPartners(partnersData || []);
    } catch (err) {
      console.error("Error fetching partners:", err);
      setError(err.message);
      showNotification("error", "Failed to load partners");
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

    fetchPartners();
  }, [navigate]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const handleEditClick = (partner) => {
    setEditingPartner(partner);
    setEditForm({
      partner_name: partner.partner_name || "",
      partner_url: partner.partner_url || "",
      partner_logo: null,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "partner_logo" ? files[0] : value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("partner_name", editForm.partner_name);
      formData.append("partner_url", editForm.partner_url);
      if (editForm.partner_logo) {
        formData.append("partner_logo", editForm.partner_logo);
      }

      await apiClient.put(`/api/partners/${editingPartner.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      showNotification("success", "Partner updated successfully");
      setEditingPartner(null);
      fetchPartners();
    } catch (err) {
      console.error("Error updating partner:", err);
      showNotification("error", "Failed to update partner");
    }
  };

  const handleDeletePartner = async (partnerId) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      try {
        const token = localStorage.getItem("authToken");
        await apiClient.delete(`/api/partners/${partnerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        showNotification("success", "Partner deleted successfully");
        fetchPartners();
      } catch (err) {
        console.error("Error deleting partner:", err);
        showNotification("error", "Failed to delete partner");
      }
    }
  };

  const handleCreateChange = (e) => {
    const { name, value, files } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: name === "partner_logo" ? files[0] : value,
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("partner_name", createForm.partner_name);
      formData.append("partner_url", createForm.partner_url);
      if (createForm.partner_logo) {
        formData.append("partner_logo", createForm.partner_logo);
      }

      await apiClient.post("/api/partners", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      showNotification("success", "Partner created successfully");
      setShowCreateForm(false);
      setCreateForm({
        partner_name: "",
        partner_url: "",
        partner_logo: null,
      });
      fetchPartners();
    } catch (err) {
      console.error("Error creating partner:", err);
      showNotification(
        "error",
        err.response?.data?.message || "Failed to create partner"
      );
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredPartners = Array.isArray(partners)
    ? partners.filter((partner) =>
        partner?.partner_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const indexOfLastPartner = currentPage * partnersPerPage;
  const indexOfFirstPartner = indexOfLastPartner - partnersPerPage;
  const currentPartners = filteredPartners.slice(
    indexOfFirstPartner,
    indexOfLastPartner
  );
  const totalPages = Math.ceil(filteredPartners.length / partnersPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "N/A";
    }
  };

  const getLogoUrl = (logoPath) => {
    if (!logoPath) return null;
    if (logoPath.startsWith("http")) return logoPath;
    return `${apiClient.defaults.baseURL}${logoPath}`;
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
        <h1 className="text-2xl font-bold text-gray-800">
          Partners Management
        </h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search partners..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
          >
            <FiPlus className="mr-2" />
            Add Partner
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Logo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPartners.length > 0 ? (
                    currentPartners.map((partner) => {
                      const logoUrl = getLogoUrl(partner.partner_logo);
                      return (
                        <tr key={partner.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt={partner.partner_name || "Partner logo"}
                                className="h-10 w-10 object-contain"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%' y='50%' font-family='sans-serif' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%239ca3af'%3ENo logo%3C/text%3E%3C/svg%3E";
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-xs text-gray-500">
                                  No logo
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {partner.partner_name || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {partner.partner_url ? (
                              <a
                                href={partner.partner_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {partner.partner_url}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(partner.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(partner.updatedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditClick(partner)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <FiEdit />
                              </button>
                              <button
                                onClick={() => handleDeletePartner(partner.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        {searchTerm
                          ? "No partners match your search"
                          : "No partners found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {filteredPartners.length > partnersPerPage && (
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

      {/* Edit Partner Modal */}
      <Modal isOpen={!!editingPartner} onClose={() => setEditingPartner(null)}>
        <h2 className="text-xl font-bold mb-4">Edit Partner</h2>
        <form onSubmit={handleEditSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Partner Name
            </label>
            <input
              type="text"
              name="partner_name"
              value={editForm.partner_name}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Partner URL
            </label>
            <input
              type="url"
              name="partner_url"
              value={editForm.partner_url}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Partner Logo
            </label>
            <input
              type="file"
              name="partner_logo"
              onChange={handleEditChange}
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {editingPartner?.partner_logo && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Current Logo:</p>
                <img
                  src={getLogoUrl(editingPartner.partner_logo)}
                  alt="Current logo"
                  className="h-20 object-contain border border-gray-200 rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%' y='50%' font-family='sans-serif' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%239ca3af'%3ENo image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            )}
            {editForm.partner_logo && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">New Logo Preview:</p>
                <img
                  src={URL.createObjectURL(editForm.partner_logo)}
                  alt="New logo preview"
                  className="h-20 object-contain border border-gray-200 rounded"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setEditingPartner(null)}
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

      {/* Create Partner Modal */}
      <Modal isOpen={showCreateForm} onClose={() => setShowCreateForm(false)}>
        <h2 className="text-xl font-bold mb-4">Add New Partner</h2>
        <form onSubmit={handleCreateSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Partner Name *
            </label>
            <input
              type="text"
              name="partner_name"
              value={createForm.partner_name}
              onChange={handleCreateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Partner URL *
            </label>
            <input
              type="url"
              name="partner_url"
              value={createForm.partner_url}
              onChange={handleCreateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Partner Logo
            </label>
            <input
              type="file"
              name="partner_logo"
              onChange={handleCreateChange}
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {createForm.partner_logo && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Logo Preview:</p>
                <img
                  src={URL.createObjectURL(createForm.partner_logo)}
                  alt="Logo preview"
                  className="h-20 object-contain border border-gray-200 rounded"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
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
              Create Partner
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Partners;

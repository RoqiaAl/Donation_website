import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../hooks/apiClient";
import { FiEdit, FiUserPlus } from "react-icons/fi";
import Modal from "../components/Modal";

const Donors = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [editingDonor, setEditingDonor] = useState(null);
  const [editForm, setEditForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    birth_date: "",
    gender_id: "",
    address: "",
    governorate_id: "",
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    user_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    birth_date: "",
    gender_id: "",
    address: "",
    governorate_id: "",
  });
  const [governorates, setGovernorates] = useState([]);
  const [genders, setGenders] = useState([]);
  const [potentialUsers, setPotentialUsers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await apiClient.get("/api/admin-dashboard/donors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDonors(response.data || []);
    } catch (err) {
      console.error(
        "Error fetching donors:",
        err.response?.data || err.message
      );
      setError(err.message);
      showNotification("error", "Failed to load donors");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchGovernorates = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await apiClient.get("/reference-data/governate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGovernorates(response.data || []);
    } catch (err) {
      console.error("Failed to fetch governorates:", err);
      showNotification("error", "Failed to load governorates");
    }
  };

  const fetchGenders = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await apiClient.get("/reference-data/gender", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGenders(response.data || []);
    } catch (err) {
      console.error("Failed to fetch genders:", err);
      showNotification("error", "Failed to load genders");
    }
  };

  const fetchPotentialUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await apiClient.get(
        "/api/admin-dashboard/users?role=2",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPotentialUsers(response.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      showNotification("error", "Failed to load potential users");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchDonors();
    fetchGovernorates();
    fetchGenders();
    fetchPotentialUsers();
  }, [navigate]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const handleEditClick = (donor) => {
    setEditingDonor(donor);
    setEditForm({
      first_name: donor.first_name,
      middle_name: donor.middle_name || "",
      last_name: donor.last_name,
      birth_date: donor.birth_date.split("T")[0],
      gender_id: donor.gender_id,
      address: donor.address,
      governorate_id: donor.governorate_id,
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
        `/api/admin-dashboard/donors/${editingDonor.id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showNotification("success", "Donor updated successfully");
      setEditingDonor(null);
      fetchDonors();
    } catch (err) {
      console.error("Error updating donor:", err.response?.data || err.message);
      showNotification("error", "Failed to update donor");
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateCreateForm = () => {
    const newErrors = {};
    if (!createForm.user_id) newErrors.user_id = "User is required";
    if (!createForm.first_name) newErrors.first_name = "First name is required";
    if (!createForm.last_name) newErrors.last_name = "Last name is required";
    if (!createForm.birth_date) newErrors.birth_date = "Birth date is required";
    if (!createForm.gender_id) newErrors.gender_id = "Gender is required";
    if (!createForm.address) newErrors.address = "Address is required";
    if (!createForm.governorate_id)
      newErrors.governorate_id = "Governorate is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validateCreateForm()) return;

    try {
      const token = localStorage.getItem("authToken");
      await apiClient.post(
        `/api/admin-dashboard/donors/${createForm.user_id}`,
        {
          first_name: createForm.first_name,
          middle_name: createForm.middle_name,
          last_name: createForm.last_name,
          birth_date: createForm.birth_date,
          gender_id: createForm.gender_id,
          address: createForm.address,
          governorate_id: createForm.governorate_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showNotification("success", "Donor created successfully");
      setShowCreateForm(false);
      setCreateForm({
        user_id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        birth_date: "",
        gender_id: "",
        address: "",
        governorate_id: "",
      });
      fetchDonors();
    } catch (err) {
      console.error("Error creating donor:", err.response?.data || err.message);
      showNotification(
        "error",
        err.response?.data?.message || "Failed to create donor"
      );
    }
  };

  const getGovernorateName = (id) => {
    const gov = governorates.find((g) => g.id === id);
    return gov ? gov.value : "Unknown";
  };

  const getGenderName = (id) => {
    const gender = genders.find((g) => g.id === id);
    return gender ? gender.value : "Unknown";
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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Donors Management</h1>
        <div className="relative">
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiUserPlus className="mr-2" />
            Add Donor
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
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Birth Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Governorate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donors.map((donor) => (
                  <tr key={donor.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donor.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donor.first_name} {donor.middle_name} {donor.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(donor.birth_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getGenderName(donor.gender_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donor.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getGovernorateName(donor.governorate_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(donor)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Donor Modal */}
      <Modal isOpen={!!editingDonor} onClose={() => setEditingDonor(null)}>
        <h2 className="text-xl font-bold mb-4">Edit Donor</h2>
        <form onSubmit={handleEditSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={editForm.first_name}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                name="middle_name"
                value={editForm.middle_name}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={editForm.last_name}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Date
              </label>
              <input
                type="date"
                name="birth_date"
                value={editForm.birth_date}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender_id"
                value={editForm.gender_id}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Gender</option>
                {genders.map((gender) => (
                  <option key={gender.id} value={gender.id}>
                    {gender.value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Governorate
              </label>
              <select
                name="governorate_id"
                value={editForm.governorate_id}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Governorate</option>
                {governorates.map((gov) => (
                  <option key={gov.id} value={gov.id}>
                    {gov.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={editForm.address}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setEditingDonor(null)}
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

      {/* Create Donor Modal */}
      <Modal isOpen={showCreateForm} onClose={() => setShowCreateForm(false)}>
        <h2 className="text-xl font-bold mb-4">Add New Donor</h2>
        <form onSubmit={handleCreateSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select User
            </label>
            <select
              name="user_id"
              value={createForm.user_id}
              onChange={handleCreateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select User</option>
              {potentialUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email} (ID: {user.id})
                </option>
              ))}
            </select>
            {errors.user_id && (
              <p className="text-red-500 text-xs mt-1">{errors.user_id}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={createForm.first_name}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                name="middle_name"
                value={createForm.middle_name}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={createForm.last_name}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Date
              </label>
              <input
                type="date"
                name="birth_date"
                value={createForm.birth_date}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              {errors.birth_date && (
                <p className="text-red-500 text-xs mt-1">{errors.birth_date}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender_id"
                value={createForm.gender_id}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Gender</option>
                {genders.map((gender) => (
                  <option key={gender.id} value={gender.id}>
                    {gender.value}
                  </option>
                ))}
              </select>
              {errors.gender_id && (
                <p className="text-red-500 text-xs mt-1">{errors.gender_id}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Governorate
              </label>
              <select
                name="governorate_id"
                value={createForm.governorate_id}
                onChange={handleCreateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Governorate</option>
                {governorates.map((gov) => (
                  <option key={gov.id} value={gov.id}>
                    {gov.value}
                  </option>
                ))}
              </select>
              {errors.governorate_id && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.governorate_id}
                </p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={createForm.address}
              onChange={handleCreateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
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
              Create Donor
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Donors;

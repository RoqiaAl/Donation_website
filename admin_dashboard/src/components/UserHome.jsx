import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../hooks/apiClient";
import { FiEdit, FiPause, FiLock, FiPlay, FiUserPlus } from "react-icons/fi";
import Modal from "../components/Modal";

const UserHome = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editForm, setEditForm] = useState({
    email: "",
    user_name: "",
    phone: "",
    role_id: null,
  });
  const [createForm, setCreateForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role_id: "",
    governorate_id: "",
  });
  const [roles, setRoles] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [errors, setErrors] = useState({});

  // Notification timeout
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fetch data on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, rolesRes, govRes] = await Promise.all([
          apiClient.get("/api/admin-dashboard/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          apiClient.get("/roles", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          apiClient.get("/reference-data/governate", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Sort users by ID in ascending order
       const sortedUsers = (usersRes.data || []).sort((a, b) => a.id - b.id);
        setUsers(sortedUsers);
        setRoles(rolesRes.data || []);
        setGovernorates(govRes.data || []);
      } catch (err) {
        setError(err.message);
        showNotification("error", "Failed to load data");
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const usersRes = await apiClient.get("/api/admin-dashboard/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Sort users by ID in descending order
      const sortedUsers = (usersRes.data || []).sort((a, b) => b.id - a.id);
      setUsers(sortedUsers);
    } catch (err) {
      setError(err.message);
      showNotification("error", "Failed to fetch users");
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem("authToken");
      await apiClient.patch(
        `/api/admin-dashboard/users/${userId}/status`,
        { user_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification(
        "success",
        `User status updated to ${getStatusText(newStatus)}`
      );
      fetchUsers();
    } catch (err) {
      showNotification("error", "Failed to update user status");
    }
  };

  const handleActivateUser = (userId) => handleStatusChange(userId, 1);

  // Edit functionality
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      email: user.email,
      user_name: user.user_name,
      phone: user.phone,
      role_id: user.role_id,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        email: editForm.email,
        user_name: editForm.user_name,
        phone: editForm.phone,
        role_id: editForm.role_id,
      };

      await apiClient.put(
        `/api/admin-dashboard/users/${editingUser.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification("success", "User updated successfully");
      setEditingUser(null);
      // Update local state while maintaining sort order
      setUsers(
        users
          .map((u) => (u.id === editingUser.id ? { ...u, ...payload } : u))
          .sort((a, b) => b.id - a.id)
      );
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Failed to update user"
      );
    }
  };

  // Create functionality
  const validateCreateForm = () => {
    const newErrors = {};
    if (!createForm.email) newErrors.email = "Email is required";
    if (!createForm.username) newErrors.username = "Username is required";
    if (!createForm.password) newErrors.password = "Password is required";
    if (createForm.password !== createForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!createForm.role_id) newErrors.role_id = "Role is required";
    if (createForm.role_id === "2" && !createForm.governorate_id) {
      newErrors.governorate_id = "Governorate is required for donors";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validateCreateForm()) return;

    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        email: createForm.email,
        username: createForm.username,
        password: createForm.password,
        phone: createForm.phone,
        role: parseInt(createForm.role_id),
        ...(createForm.role_id === "2" && {
          governorate: createForm.governorate_id,
        }),
      };

      const endpoint =
        createForm.role_id === "3"
          ? "/auth/admin/register"
          : "/auth/donor/register";

      await apiClient.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showNotification("success", "User created successfully");
      setShowCreateForm(false);
      setCreateForm({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        phone: "",
        role_id: "",
        governorate_id: "",
      });
      fetchUsers();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Failed to create user"
      );
    }
  };

  // Helper functions
  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Active";
      case 2:
        return "Suspended";
      case 3:
        return "Blocked";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-yellow-100 text-yellow-800";
      case 3:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.role_name : "Unknown";
  };

  return (
    <div className="container mx-auto p-4">
      {/* Notification */}
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
            className="ml-4 text-sm font-medium"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FiUserPlus className="mr-2" />
          Create User
        </button>
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
                    ID ↓
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.user_name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getRoleName(user.role_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          user.user_status
                        )}`}
                      >
                        {getStatusText(user.user_status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      {(user.user_status === 2 || user.user_status === 3) && (
                        <button
                          onClick={() => handleActivateUser(user.id)}
                          className="text-green-500 hover:text-green-700"
                          title="Activate"
                        >
                          <FiPlay />
                        </button>
                      )}
                      {user.user_status === 1 && (
                        <button
                          onClick={() => handleStatusChange(user.id, 2)}
                          className="text-yellow-500 hover:text-yellow-700"
                          title="Suspend"
                        >
                          <FiPause />
                        </button>
                      )}
                      {user.user_status !== 3 && (
                        <button
                          onClick={() => handleStatusChange(user.id, 3)}
                          className="text-red-500 hover:text-red-700"
                          title="Block"
                        >
                          <FiLock />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)}>
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleEditSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={editForm.user_name}
              onChange={(e) =>
                setEditForm({ ...editForm, user_name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) =>
                setEditForm({ ...editForm, phone: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={editForm.role_id || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, role_id: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.role_name} (ID: {role.id})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
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

      {/* Create User Modal */}
      <Modal isOpen={showCreateForm} onClose={() => setShowCreateForm(false)}>
        <h2 className="text-xl font-bold mb-4">Create New User</h2>
        <form onSubmit={handleCreateSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={createForm.email}
              onChange={(e) =>
                setCreateForm({ ...createForm, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={createForm.username}
              onChange={(e) =>
                setCreateForm({ ...createForm, username: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={createForm.password}
              onChange={(e) =>
                setCreateForm({ ...createForm, password: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={createForm.confirmPassword}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={createForm.phone}
              onChange={(e) =>
                setCreateForm({ ...createForm, phone: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role_id"
              value={createForm.role_id}
              onChange={(e) =>
                setCreateForm({ ...createForm, role_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Role</option>
              {roles
                .filter((r) => ["2", "3"].includes(r.id.toString()))
                .map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.role_name} (ID: {role.id})
                  </option>
                ))}
            </select>
            {errors.role_id && (
              <p className="text-red-500 text-xs mt-1">{errors.role_id}</p>
            )}
          </div>
          {createForm.role_id === "2" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Governorate
              </label>
              <select
                name="governorate_id"
                value={createForm.governorate_id}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    governorate_id: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required={createForm.role_id === "2"}
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
          )}
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
              Create User
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserHome;

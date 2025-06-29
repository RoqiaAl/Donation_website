import { useState, useEffect } from "react";
import apiClient from "../../hooks/apiClient";
import { jwtDecode } from "jwt-decode";

export default function Profile() {
  const [user, setUser] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    birth_date: "",
    governorate_id: "",
    address: "",
    gender_id: "",
    email: "",
    phone: "",
    user_name: ""
  });

  const [governates, setGovernates] = useState([]);
  const [genders, setGenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donorId, setDonorId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const isAuthenticated = Boolean(token);

        if (!isAuthenticated) {
          throw new Error("Authentication required");
        }

        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const decoded = jwtDecode(token);
        const idFromToken = decoded.donorId || decoded.id;
        if (!idFromToken) {
          throw new Error("Donor ID not found in token");
        }
        setDonorId(idFromToken);

        const [profileRes, governatesRes, gendersRes] = await Promise.all([
          apiClient.get(`/api/donor-dashboard/profile/${idFromToken}`),
          apiClient.get("/reference-data/governate"),
          apiClient.get("/reference-data/gender"),
        ]);

        const profileData = profileRes.data;

        setGovernates(governatesRes.data);
        setGenders(gendersRes.data);

        setUser({
          first_name: profileData.first_name || "",
          middle_name: profileData.middle_name || "",
          last_name: profileData.last_name || "",
          birth_date: profileData.birth_date || "",
          governorate_id: profileData.governorate_id || "",
          address: profileData.address || "",
          gender_id: profileData.gender_id || "",
          email: profileData.Auth?.email || "",
          phone: profileData.User?.phone || "",
          user_name: profileData.User?.user_name || ""
        });
      } catch (err) {
        console.error("Profile error:", err);
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await apiClient.put(
        `/api/donor-dashboard/profile/${donorId}`,
        {
          first_name: user.first_name,
          middle_name: user.middle_name,
          last_name: user.last_name,
          birth_date: user.birth_date,
          governorate_id: user.governorate_id,
          address: user.address,
          gender_id: user.gender_id,
          phone: user.phone,
          user_name: user.user_name
        }
      );

      console.log("Profile updated:", response.data);
      setSuccessMessage("Profile updated successfully!");

      if (response.data.newToken) {
        localStorage.setItem("token", response.data.newToken);
      }

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !successMessage) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-6 border-b pb-2">Your Profile</h2>

      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="space-y-4">
          <FormField
            label="First Name"
            name="first_name"
            value={user.first_name}
            onChange={handleChange}
          />
          <FormField
            label="Middle Name"
            name="middle_name"
            value={user.middle_name}
            onChange={handleChange}
          />
          <FormField
            label="Last Name"
            name="last_name"
            value={user.last_name}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-4">
          <FormField
            label="Email"
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            disabled
          />
          <FormField
            label="Username"
            name="user_name"
            value={user.user_name}
            onChange={handleChange}
          />
          <FormField
            label="Birthdate"
            type="date"
            name="birth_date"
            value={user.birth_date}
            onChange={handleChange}
          />
        </div>

        {/* Address and Phone on the same line */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Address"
            name="address"
            value={user.address}
            onChange={handleChange}
          />
          <FormField
            label="Phone"
            type="tel"
            name="phone"
            value={user.phone}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Governorate"
            name="governorate_id"
            value={user.governorate_id}
            options={governates}
            onChange={handleChange}
          />
          <FormSelect
            label="Gender"
            name="gender_id"
            value={user.gender_id}
            options={genders}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

function FormSelect({ label, name, value, options, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-200"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.value || opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function FormField({
  label,
  type = "text",
  name,
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-200 ${
          disabled ? "bg-gray-100" : ""
        }`}
      />
    </div>
  );
}
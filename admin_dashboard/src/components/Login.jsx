import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../hooks/apiClient";
import {
  FaLock,
  FaEnvelope,
  FaMobileAlt,
  FaShieldAlt,
  FaSignInAlt,
  FaQuestionCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

export const AdminLoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    totp_code: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "", // 'success' or 'error'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type,
    });
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification({
        show: false,
        message: "",
        type: "",
      });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ show: false, message: "", type: "" });

    try {
      const { data } = await apiClient.post("/auth/admin/login", formData);

      if (data.success) {
        showNotification(
          data.message || "Login successful! Redirecting...",
          "success"
        );
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("isAuthenticated", "true");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        showNotification(
          data.message || "Login failed. Please try again.",
          "error"
        );
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "An error occurred during login";
      showNotification(errorMessage, "error");
      localStorage.removeItem("authToken");
      localStorage.removeItem("isAuthenticated");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6BDCF6] to-[#1598D2] p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with icon */}
        <div className="bg-[#1598D2] p-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <FaShieldAlt className="text-2xl text-white" />
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          </div>
          <p className="text-[#F7CDC7] mt-1 flex items-center justify-center">
            <FaLock className="mr-1" /> Secure access to your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Notification System */}
          {notification.show && (
            <div
              className={`p-3 rounded-lg text-sm flex items-start ${
                notification.type === "success"
                  ? "bg-[#2DC5F2] text-white"
                  : "bg-[#F4B5AE] text-white"
              }`}
            >
              {notification.type === "success" ? (
                <FaCheckCircle className="mr-2 mt-0.5 flex-shrink-0" />
              ) : (
                <FaExclamationTriangle className="mr-2 mt-0.5 flex-shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
            >
              <FaEnvelope className="mr-2 text-[#1598D2]" />
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2DC5F2] focus:border-[#2DC5F2] outline-none transition"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
            >
              <FaLock className="mr-2 text-[#1598D2]" />
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2DC5F2] focus:border-[#2DC5F2] outline-none transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* TOTP Field */}
          <div>
            <label
              htmlFor="totp_code"
              className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
            >
              <FaMobileAlt className="mr-2 text-[#1598D2]" />
              Authentication Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMobileAlt className="text-gray-400" />
              </div>
              <input
                type="text"
                id="totp_code"
                name="totp_code"
                value={formData.totp_code}
                onChange={handleChange}
                required
                pattern="\d{6}"
                maxLength={6}
                className="w-full pl-10 pr-16 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2DC5F2] focus:border-[#2DC5F2] outline-none transition"
                placeholder="123456"
              />
              <div className="absolute right-3 top-2.5 text-xs text-gray-500 flex items-center">
                <FaShieldAlt className="mr-1" /> 6-digit
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition flex items-center justify-center ${
                isLoading
                  ? "bg-[#6BDCF6] cursor-not-allowed"
                  : "bg-[#1598D2] hover:bg-[#2DC5F2]"
              }`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                <>
                  <FaSignInAlt className="mr-2" />
                  Login
                </>
              )}
            </button>
          </div>

          {/* Help Link */}
          <div className="text-center text-sm text-gray-600 flex items-center justify-center">
            <FaQuestionCircle className="mr-1 text-[#1598D2]" />
            <p>
              Need help?{" "}
              <a href="#" className="text-[#1598D2] hover:underline">
                Contact support
              </a>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center flex items-center justify-center">
          <FaShieldAlt className="text-[#2DC5F2] mr-1" />
          <p className="text-xs text-gray-500">
            Secure access powered by <span className="text-[#2DC5F2]">2FA</span>
          </p>
        </div>
      </div>
    </div>
  );
};

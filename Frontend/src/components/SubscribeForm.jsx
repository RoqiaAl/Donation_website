import React, { useState } from "react";
import { FaEnvelope, FaUser, FaCalendarAlt, FaBell } from "react-icons/fa";
import subscribeImg from "../assets/subscripe3.png";
import apiClient from "../hooks/apiClient";

function FloatingInput({
  id,
  name,
  label,
  type = "text",
  Icon,
  value,
  onChange,
}) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-3 text-[#6BDCF6]" />}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
        className="
          w-full
          pl-10 pr-3 py-3
          border border-[#6BDCF6] rounded-lg
          focus:border-[#1598D2] focus:outline-none
          transition
          text-gray-700
        "
      />
    </div>
  );
}

export default function SubscribeForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    date: "",
    setReminder: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await apiClient.post("/api/subscriptions", formData);
      setSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        date: "",
        setReminder: false,
      });
    } catch (err) {
      console.error("Subscription error:", err);
      alert("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 px-4 bg-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="lg:w-2/5 bg-[#1598D2] bg-opacity-10 flex items-center justify-center p-8">
            <div className="text-center">
              <img
                src={subscribeImg}
                alt="Join our community"
                className="rounded-lg shadow-md w-full h-auto max-h-64 object-cover"
              />
              <h3 className="mt-4 text-xl font-semibold text-[#1598D2]">
                Join Our Community
              </h3>
              <p className="text-gray-600 mt-2">
                Be part of our healthcare mission
              </p>
            </div>
          </div>

          <div className="lg:w-3/5 p-6 md:p-8">
            <div className="flex items-center mb-6">
              <div className="bg-[#F7CDC7] bg-opacity-30 p-3 rounded-full mr-4">
                <FaEnvelope className="text-xl text-[#1598D2]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1598D2]">
                  Stay Updated
                </h2>
                <div className="w-12 h-1 bg-[#F4B5AE] mt-2"></div>
              </div>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#F4B5AE] mb-4">
                  <FaEnvelope className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-medium text-[#1598D2] mb-1">
                  Thank You!
                </h3>
                <p className="text-sm text-gray-600">
                  You have successfully subscribed to updates.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingInput
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    Icon={FaUser}
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <FloatingInput
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    Icon={FaUser}
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                <FloatingInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  Icon={FaEnvelope}
                  value={formData.email}
                  onChange={handleChange}
                />

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                  <div className="flex-1">
                    <FloatingInput
                      id="date"
                      name="date"
                      type="date"
                      label="Birthday (optional)"
                      Icon={FaCalendarAlt}
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>

                  <label
                    htmlFor="setReminder"
                    className="flex items-center space-x-2 text-gray-700 text-sm"
                  >
                    <input
                      id="setReminder"
                      name="setReminder"
                      type="checkbox"
                      checked={formData.setReminder}
                      onChange={handleChange}
                      className="h-5 w-5 text-[#1598D2] border-gray-300 rounded focus:ring-[#1598D2]"
                    />
                    <FaBell className="text-[#6BDCF6]" />
                    <span>Set Reminder</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-[#1598D2] hover:bg-[#1280b0] text-white font-medium py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1598D2] transition ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Submitting..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

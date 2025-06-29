import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../hooks/apiClient";
import { FiPause, FiPlay, FiSearch } from "react-icons/fi";
import Pagination from "../components/Pagination";

const Reviews = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const testimonialsPerPage = 6;

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await apiClient.get("/api/testimonials/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setTestimonials(response.data.testimonials || []);
      } else {
        throw new Error("Failed to fetch testimonials");
      }
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setError(err.message);
      showNotification("error", "Failed to load testimonials");
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

    fetchTestimonials();
  }, [navigate]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const toggleTestimonialStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("authToken");
      const newStatus = currentStatus === "approved" ? "pending" : "approved";

      await apiClient.put(
        `/api/testimonials/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showNotification(
        "success",
        `Testimonial ${
          newStatus === "approved" ? "approved" : "paused"
        } successfully`
      );
      fetchTestimonials();
    } catch (err) {
      console.error("Error updating testimonial status:", err);
      showNotification("error", "Failed to update testimonial status");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTestimonials = Array.isArray(testimonials)
    ? testimonials.filter(
        (testimonial) =>
          testimonial?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          testimonial?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          testimonial?.content
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          testimonial?.status?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const indexOfLastTestimonial = currentPage * testimonialsPerPage;
  const indexOfFirstTestimonial = indexOfLastTestimonial - testimonialsPerPage;
  const currentTestimonials = filteredTestimonials.slice(
    indexOfFirstTestimonial,
    indexOfLastTestimonial
  );
  const totalPages = Math.ceil(
    filteredTestimonials.length / testimonialsPerPage
  );

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `${apiClient.defaults.baseURL}${imagePath}`;
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
        <h1 className="text-2xl font-bold text-gray-800">Customer Reviews</h1>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="w-5 h-5 text-gray-400" />
          </div>
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
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentTestimonials.length > 0 ? (
                    currentTestimonials.map((testimonial) => {
                      const imageUrl = getImageUrl(testimonial.imageUrl);
                      return (
                        <tr key={testimonial.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={testimonial.name || "Reviewer"}
                                className="h-10 w-10 object-cover rounded-full"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-gray-500"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                </svg>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {testimonial.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {testimonial.email || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {testimonial.content || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                testimonial.status
                              )}`}
                            >
                              {testimonial.status || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(testimonial.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() =>
                                toggleTestimonialStatus(
                                  testimonial.id,
                                  testimonial.status
                                )
                              }
                              className={`flex items-center px-3 py-1 rounded-md text-sm ${
                                testimonial.status === "approved"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                  : "bg-green-100 text-green-800 hover:bg-green-200"
                              }`}
                              title={
                                testimonial.status === "approved"
                                  ? "Pause review"
                                  : "Approve review"
                              }
                            >
                              {testimonial.status === "approved" ? (
                                <>
                                  <FiPause className="mr-1" /> Pause
                                </>
                              ) : (
                                <>
                                  <FiPlay className="mr-1" /> Approve
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        {searchTerm
                          ? "No reviews match your search"
                          : "No reviews found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {filteredTestimonials.length > testimonialsPerPage && (
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
    </div>
  );
};

export default Reviews;

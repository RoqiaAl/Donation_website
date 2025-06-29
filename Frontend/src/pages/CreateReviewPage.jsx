import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../hooks/apiClient";
import testimonialImage from "../assets/subscripe3.png";
import "./CreateReviewPage.css"; // Import the CSS file for this component

const CreateReviewPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    content: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // New state for stats
  const [testimonialStats, setTestimonialStats] = useState({
    total: 0,
    byStatus: [],
  });

  // Fetch testimonial statistics on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get("/api/statistics/testimonials");
        if (res.data.success) {
          setTestimonialStats(res.data.data);
        }
      } catch (err) {
        console.error("Could not load testimonial stats", err);
      }
    };
    fetchStats();
  }, []);

  // derive values
  const total = testimonialStats.total || 0;
  const approvedCount =
    testimonialStats.byStatus.find((s) => s.status === "approved")?.count || 0;
  const pendingCount =
    testimonialStats.byStatus.find((s) => s.status === "pending")?.count || 0;
  const positivePct = total > 0 ? Math.round((approvedCount / total) * 100) : 0;

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email is invalid";
    if (!form.content.trim()) errs.content = "Testimonial is required";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((f) => ({ ...f, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("content", form.content);
      if (form.image) data.append("image", form.image);

      const res = await apiClient.post("/api/testimonials", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        navigate("/testimonials/create");
      } else {
        setServerError(res.data.message || "Submission failed");
      }
    } catch (err) {
      setServerError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Impact */}
      <div className="relative bg-gray-900 text-white" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-black/60 z-0" />
        <img
          src={testimonialImage}
          alt="Happy customer"
          className="w-full h-96 object-cover"
          style={{ zIndex: 0 }}
        />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Share Your Experience</h1>
          <p className="text-xl max-w-2xl mb-8">
            Your feedback helps us improve and inspires others to take action
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-3xl font-bold mb-2">
                {total.toLocaleString()}
              </h3>
              <p>Testimonials Collected</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-3xl font-bold mb-2">{positivePct}%</h3>
              <p>Positive Feedback</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-3xl font-bold mb-2">
                {pendingCount.toLocaleString()}
              </h3>
              <p>Pending Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Form Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Inspirational Quote / Tips */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Your Voice Matters
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We value your honest feedback. Share your experience with our
              community and help others make informed decisions.
            </p>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Words to Inspire Your Submission
              </h3>
              <div className="bg-blue-50 p-6 rounded-lg mb-8 border-l-4 border-blue-500">
                <svg
                  className="w-8 h-8 text-blue-400 mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-lg italic text-gray-700 mb-3">
                  "Healthcare is not just about medicine and treatments. It's
                  about compassion, listening, and caring for the whole person."
                </p>
                <p className="text-gray-600">— Dr. Atul Gawande</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Making Your Voice Heard
                </h4>
                <ul className="space-y-3">
                  {[
                    "Be specific about your experience",
                    "Share what mattered most to you",
                    "Your story helps improve care for others",
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Submission Form */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 py-4 px-6">
              <h2 className="text-xl font-semibold text-white">
                Submit Your Testimonial
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {serverError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {serverError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Your Testimonial
                </label>
                <textarea
                  name="content"
                  rows="5"
                  value={form.content}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.content ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Share your experience..."
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                )}
              </div>

              {/* Image */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Upload Photo (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className="hidden"
                    />
                  </label>
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-16 w-16 object-cover rounded-full border-2 border-white shadow"
                    />
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Testimonial"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReviewPage;

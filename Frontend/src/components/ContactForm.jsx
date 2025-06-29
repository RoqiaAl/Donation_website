import React, { useState } from "react";
import { FiMail, FiPhone, FiUser, FiMessageSquare } from "react-icons/fi";
import apiClient from "../hooks/apiClient";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post("/api/contact", formData);
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 px-4 bg-gray-50 bg-opacity-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1598D2] mb-3">Contact Us</h2>
          <p className="text-lg text-[#1598D2]">
            Have questions? We're here to help!
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#6BDCF6]">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-1 bg-gradient-to-b from-[#2DC5F2] to-[#6BDCF6] p-8 text-white flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
              <p className="mb-6">
                Fill out the form and we'll respond within 24 hours.
              </p>
              <address className="not-italic space-y-4">
                <div className="flex items-center">
                  <FiMail className="mr-3 text-[#F4B5AE]" size={20} />
                  <a
                    href="mailto:contact@yourngo.org"
                    className="underline hover:text-gray-200"
                  >
                    contact@givehopeorg.com
                  </a>
                </div>
                <div className="flex items-center">
                  <FiPhone className="mr-3 text-[#F4B5AE]" size={20} />
                  <a
                    href="tel:+15551234567"
                    className="underline hover:text-gray-200"
                  >
                    00967 (777) 123‑4567
                  </a>
                </div>
              </address>
            </div>

            <div className="md:col-span-2 p-8">
              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#F4B5AE] mb-4">
                    <FiMail className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-[#1598D2] mb-1">
                    Thank You!
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your message has been sent. We'll contact you soon.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-6 px-4 py-2 bg-[#2DC5F2] text-white rounded-md hover:bg-[#1598D2] transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-[#1598D2] mb-1"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-3 text-[#6BDCF6]" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2 border border-[#6BDCF6] rounded-lg focus:border-[#1598D2] focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[#1598D2] mb-1"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-3 text-[#6BDCF6]" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2 border border-[#6BDCF6] rounded-lg focus:border-[#1598D2] focus:outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-[#1598D2] mb-1"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-3 text-[#6BDCF6]" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-[#6BDCF6] rounded-lg focus:border-[#1598D2] focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[#1598D2] mb-1"
                    >
                      Your Message
                    </label>
                    <div className="relative">
                      <FiMessageSquare className="absolute left-3 top-3 text-[#6BDCF6]" />
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-[#6BDCF6] rounded-lg focus:border-[#1598D2] focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-3 px-4 rounded-md text-white bg-[#2DC5F2] hover:bg-[#1598D2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6BDCF6] transition-colors ${
                      isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

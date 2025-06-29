import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "../hooks/apiClient";
import PropTypes from "prop-types";

const WelcomeRegistrationPage = () => {
  const { state } = useLocation();
  const {
    message = "Registration initiated. Please check your email to verify your account.",
    email = "",
  } = state || {};
  const [isLoading, setIsLoading] = useState(false);

  const toastConfig = {
    position: "top-center",
    autoClose: 5000,
    style: {
      background: "#F7CDC7",
      color: "#1598D2",
      borderLeft: "4px solid #F4B5AE",
    },
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error(
        "Email address is required to resend verification.",
        toastConfig
      );
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await apiClient.post(
        "/auth/donor/resend-verification-email",
        { email }
      );

      if (data.success) {
        toast.success(
          data.message ||
            "Verification email has been resent. Please check your inbox.",
          toastConfig
        );
      } else {
        toast.error(
          data.message ||
            "Unable to resend verification email. Please try again later.",
          toastConfig
        );
      }
    } catch (error) {
      console.error("Verification email resend error:", error);
      toast.error(
        "An unexpected error occurred while resending the verification email.",
        toastConfig
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#6BDCF6] p-4">
      <ToastContainer />

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm text-center">
        <div className="flex justify-center mb-6 animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-14 w-14 text-[#1598D2]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-3 text-[#1598D2]">
          Account Verification Required
        </h1>
        <p className="mb-6 text-[#1598D2]">{message}</p>

        <button
          onClick={handleResendVerification}
          disabled={isLoading}
          className={`text-[#2DC5F2] hover:text-[#1598D2] underline focus:outline-none ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Resend verification email"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#1598D2]"
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
              Sending...
            </span>
          ) : (
            "Resend Verification Email"
          )}
        </button>
      </div>
    </div>
  );
};

WelcomeRegistrationPage.propTypes = {
  state: PropTypes.shape({
    message: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default WelcomeRegistrationPage;

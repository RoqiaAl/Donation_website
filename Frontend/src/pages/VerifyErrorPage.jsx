import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import apiClient from "../hooks/apiClient";
import PropTypes from "prop-types";
import "react-toastify/dist/ReactToastify.css";

const VerifyErrorPage = () => {
  const [searchParams] = useSearchParams();
  const message =
    searchParams.get("msg") || "Verification failed. Please try again.";
  const email = searchParams.get("email") || "";
  const [isResending, setIsResending] = useState(false);

  const toastOptions = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
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
        toastOptions
      );
      return;
    }

    setIsResending(true);

    try {
      const { data } = await apiClient.post("/auth/donor/resend-verification", {
        email,
      });

      if (data.success) {
        toast.success(
          data.message ||
            "A new verification link has been sent to your email.",
          toastOptions
        );
      } else {
        toast.error(
          data.message ||
            "Failed to resend verification email. Please try again later.",
          toastOptions
        );
      }
    } catch (error) {
      console.error("Verification resend error:", error);
      toast.error(
        "An unexpected error occurred while processing your request.",
        toastOptions
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#6BDCF6] px-4">
      <ToastContainer />

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm text-center">
        {/* Shield with X Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-[#F7CDC7] rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-[#1598D2]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <line x1="9.5" y1="9" x2="14.5" y2="14" />
              <line x1="14.5" y1="9" x2="9.5" y2="14" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#1598D2] mb-3">
          Verification Failed
        </h1>
        <p className="text-[#1598D2] font-medium mb-4">{message}</p>
        <button
          onClick={handleResendVerification}
          disabled={isResending}
          className={`w-full flex items-center justify-center py-2.5 px-4 rounded-md text-white bg-[#2DC5F2] hover:bg-[#1598D2] focus:outline-none focus:ring-2 focus:ring-[#6BDCF6] focus:ring-offset-2 transition-colors ${
            isResending ? "opacity-75 cursor-not-allowed" : ""
          }`}
          aria-label="Resend verification email"
        >
          {isResending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            </>
          ) : (
            "Get New Verification Link"
          )}
        </button>
      </div>
    </div>
  );
};

VerifyErrorPage.propTypes = {
  searchParams: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }),
};

export default VerifyErrorPage;

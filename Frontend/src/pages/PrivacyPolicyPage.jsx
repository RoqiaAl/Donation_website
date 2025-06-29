import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  // Smooth scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-white flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-[#1598D2] px-6 py-8 sm:px-10 sm:py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-blue-100 text-lg">
              Your trust is our priority. This policy outlines how we collect,
              use, and protect your personal information in alignment with our
              mission.
            </p>
          </div>
        </div>

        {/* Content Section with Smooth Scrolling */}
        <div className="px-6 py-8 sm:px-10 sm:py-12 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Information Collection
            </h2>
            <div className="prose text-gray-600">
              <p>
                As a valued donor, we may collect personal information when you:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Register for an account on our platform</li>
                <li>Make a donation or pledge</li>
                <li>Subscribe to our newsletter</li>
                <li>Participate in surveys or events</li>
                <li>Contact our support team</li>
              </ul>
              <p className="mt-4">
                This may include your name, contact details, payment
                information, and communication preferences. We collect only
                what's necessary to serve you better and further our cause.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Use of Information
            </h2>
            <div className="prose text-gray-600">
              <p>We use your information to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Process donations and provide receipts</li>
                <li>Keep you informed about our initiatives</li>
                <li>Improve donor experience and services</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Analyze giving patterns to enhance our impact</li>
              </ul>
              <p className="mt-4">
                We will never sell your data. Your information helps us create
                meaningful change while maintaining the highest ethical
                standards.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Data Protection
            </h2>
            <div className="prose text-gray-600">
              <p>We implement robust security measures including:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Encryption of sensitive data</li>
                <li>Regular security audits</li>
                <li>Limited access to donor information</li>
                <li>Secure payment processing</li>
              </ul>
              <p className="mt-4">
                Our team undergoes privacy training, and we continuously update
                our practices to meet industry standards.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Your Rights
            </h2>
            <div className="prose text-gray-600">
              <p>As a donor, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access your personal information</li>
                <li>Request corrections to your data</li>
                <li>Opt-out of communications</li>
                <li>Request deletion of your information</li>
                <li>Receive transparent information about data practices</li>
              </ul>
            </div>
          </section>

          <div className="bg-blue-50 rounded-lg p-6 mt-8 border border-[#F4B5AE]">
            <p className="text-[#1598D2] font-medium">
              By supporting our mission, you acknowledge this privacy policy. We
              may update this policy periodically, and we encourage you to
              review it regularly.
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1598D2] hover:bg-[#1280b0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1598D2] transition-colors duration-200"
          >
            Return to Previous Page
          </button>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
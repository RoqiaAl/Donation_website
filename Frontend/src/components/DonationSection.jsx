import React from "react";
import DonationWizard from "./DonationWizard";
import { useParams } from "react-router-dom";
import securePaymentImage from "../assets/security.png";
import { FaHandHoldingHeart, FaReceipt, FaShieldAlt } from "react-icons/fa";

const DonationSection = () => {
  const { id: projectId } = useParams();
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Join Our Cause</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Your support helps us create meaningful change in communities
            worldwide
          </p>
          <div className="w-20 h-1 bg-[#1598D2] mx-auto mt-4"></div>
        </div>

        <div className="grid  grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Impact Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border-l-4 border-[#1598D2]">
            <h3 className="text-xl font-bold text-gray-900 mb-5">
              The Power of Your Contribution
            </h3>

            <div className="space-y-5">
              <div className="flex items-start">
                <div className="text-[#1598D2] mt-1 mr-4">
                  <FaHandHoldingHeart className="text-2xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Direct Impact</h4>
                  <p className="text-gray-600 mt-1">
                    82% of donations directly fund programs, ensuring maximum
                    benefit reaches those in need.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-[#1598D2] mt-1 mr-4">
                  <FaReceipt className="text-2xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Tax Benefits</h4>
                  <p className="text-gray-600 mt-1">
                    Receive immediate tax-deductible receipts for all
                    contributions to maximize your giving benefits.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-[#1598D2] mt-1 mr-4">
                  <FaShieldAlt className="text-2xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Secure Giving</h4>
                  <p className="text-gray-600 mt-1">
                    Your information is protected with bank-level encryption and
                    multiple payment options.
                  </p>
                  <div className="mt-3 flex justify-center">
                    <img
                      src={securePaymentImage}
                      alt="Secure payment badges"
                      className="max-w-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Form */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="mb-5">
              <h3 className="text-xl font-bold text-gray-900 text-center">
                Ready to Make a Difference?
              </h3>
              <p className="text-gray-600 text-sm mt-1 text-center">
                Complete your donation in just a few simple steps
              </p>
            </div>
            <DonationWizard projectId={projectId} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;

import React from "react";
import {
  FaTimes,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaLink,
} from "react-icons/fa";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";

const ShareModal = ({ isOpen, onClose, project }) => {
  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/projects/${project.id}`;
  const title = `Support ${project.projectName}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Share This Project
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <FacebookShareButton url={shareUrl} quote={title}>
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
              <FaFacebook size={24} />
            </div>
          </FacebookShareButton>

          <TwitterShareButton url={shareUrl} title={title}>
            <div className="w-12 h-12 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors">
              <FaTwitter size={24} />
            </div>
          </TwitterShareButton>

          <LinkedinShareButton url={shareUrl} title={title}>
            <div className="w-12 h-12 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-900 transition-colors">
              <FaLinkedin size={24} />
            </div>
          </LinkedinShareButton>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Or copy link</label>
          <div className="flex">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2DC5F2]"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                alert("Link copied to clipboard!");
              }}
              className="bg-[#2DC5F2] text-white px-4 py-2 rounded-r-lg hover:bg-[#1598D2] transition-colors"
            >
              <FaLink />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

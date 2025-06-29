import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaProjectDiagram,
  FaUsers,
  FaDonate,
  FaMapMarkerAlt,
} from "react-icons/fa";
import apiClient from "../hooks/apiClient"; // Import your API client

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = React.useState(null);
  const [loadingImage, setLoadingImage] = React.useState(true);

  React.useEffect(() => {
    const fetchProjectImage = async () => {
      try {
        setLoadingImage(true);
        const { data: mediaRes } = await apiClient.get(
          `/api/project-media/project/${project.id}`
        );
        
        if (mediaRes.success && mediaRes.media.length > 0) {
          // Get the first image URL
          const firstImageUrl = apiClient.defaults.baseURL + mediaRes.media[0];
          setImageUrl(firstImageUrl);
        }
      } catch (error) {
        console.error("Error fetching project media:", error);
      } finally {
        setLoadingImage(false);
      }
    };

    fetchProjectImage();
  }, [project.id]);

  const progressPercentage = Math.min(
    Math.round((project.raisedAmount / project.targetAmount) * 100),
    100
  );

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
    >
      {/* Image Section */}
      <div className="h-48 bg-gradient-to-r from-[#6BDCF6] to-[#F7CDC7] relative overflow-hidden">
        {loadingImage ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 w-full h-full"></div>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={project.projectName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = ''; // Fallback to gradient background
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {project.projectName}
            </span>
          </div>
        )}
        
        {/* Status Badge */}
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
            project.status === "Active"
              ? "bg-[#2DC5F2] text-white"
              : "bg-[#F4B5AE] text-gray-800"
          }`}
        >
          {project.status}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#1598D2] mb-2">
          {project.projectName}
        </h3>
        <div className="flex items-center text-gray-600 mb-4">
          <FaMapMarkerAlt className="h-5 w-5 mr-1 text-[#F4B5AE]" />
          <span>
            {project.governate}, {project.city}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-700 mb-1">
            <span>Raised: ${project.raisedAmount.toLocaleString()}</span>
            <span>Target: ${project.targetAmount.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#2DC5F2] h-2.5 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Beneficiaries */}
        <div className="text-center py-2 bg-[#F7CDC7] bg-opacity-30 rounded-md">
          <p className="text-gray-700">
            <span className="font-semibold text-[#1598D2]">
              {project.totalBeneficiaries.toLocaleString()}
            </span>{" "}
            beneficiaries
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
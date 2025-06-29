import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../hooks/apiClient";
import {
  FaDonate,
  FaShareAlt,
  FaUsers,
  FaChild,
  FaClinicMedical,
  FaProcedures,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  FiArrowLeft,
  FiExternalLink,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";
import {
  PieChart,
  BarChart,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ShareModal from "../components/ShareModal";

const ProjectDetails = () => {
  const { id } = useParams();
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [project, setProject] = useState(null);
  const [media, setMedia] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);

        const { data: projectData } = await apiClient.get(`/projects/${id}`);
        setProject(projectData);

        const { data: mediaRes } = await apiClient.get(
          `/api/project-media/project/${id}`
        );
        if (mediaRes.success) {
          const urls = mediaRes.media.map(
            (p) => apiClient.defaults.baseURL + p
          );
          setMedia(urls);
        }

        const { data: partnersResponse } = await apiClient.get(
          `/api/project-partners/project/${id}`
        );
        if (partnersResponse.success) {
          setPartners(partnersResponse.partners);
        }
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const nextImage = () => {
    setActiveImage((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Error Loading Project
          </h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Project Not Found
          </h2>
          <p className="text-gray-700 mb-4">
            The requested project could not be found.
          </p>
          <Link
            to="/projects"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min(
    Math.round((project.raisedAmount / project.targetAmount) * 100),
    100
  );

  const ageData = [
    { name: "Children", value: project.childern, color: "#3B82F6" },
    { name: "Adults", value: project.adults, color: "#1D4ED8" },
    { name: "Elderly", value: project.old, color: "#1E40AF" },
  ];

  const genderData = [
    { name: "Male", value: project.male, color: "#3B82F6" },
    { name: "Female", value: project.female, color: "#EC4899" },
  ];

  const healthData = [
    {
      name: "Chronic Patients",
      value: project.chronicPatient,
      color: "#F59E0B",
    },
    { name: "Weak Immunity", value: project.weakAmmunity, color: "#EC4899" },
    {
      name: "General Population",
      value:
        project.totalBeneficiaries -
        project.chronicPatient -
        project.weakAmmunity,
      color: "#3B82F6",
    },
  ];

  const fundingData = [
    { name: "Raised", amount: project.raisedAmount, fill: "#3B82F6" },
    {
      name: "Remaining",
      amount: project.targetAmount - project.raisedAmount,
      fill: "#E5E7EB",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back to Projects
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20 max-w-6xl">
        {/* Project Header with Status First */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium mr-4 ${
                project.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {project.status}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {project.projectName}
            </h1>
          </div>

          {/* Donate and Share Buttons */}
          <div className="flex space-x-4 mb-4">
            <Link
              to={`/projects/${project.id}/donate`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg flex items-center justify-center transition-colors"
            >
              <FaDonate className="mr-2" /> Donate Now
            </Link>
            <button
              onClick={() => setShowShareModal(true)}
              className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
            >
              <FaShareAlt className="mr-2" /> Share
            </button>
          </div>

          {project.location && (
            <div className="flex items-center text-gray-600">
              <FiMapPin className="mr-1" />
              <span>{project.location}</span>
            </div>
          )}
        </div>

        {/* Stats Cards with White Background */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<FaUsers className="text-blue-600" />}
            title="Total Beneficiaries"
            value={project.totalBeneficiaries.toLocaleString()}
          />
          <StatCard
            icon={<FaChild className="text-blue-500" />}
            title="Children"
            value={project.childern.toLocaleString()}
          />
          <StatCard
            icon={<FaClinicMedical className="text-amber-500" />}
            title="Chronic Patients"
            value={project.chronicPatient.toLocaleString()}
          />
          <StatCard
            icon={<FaProcedures className="text-pink-500" />}
            title="Weak Immunity"
            value={project.weakAmmunity.toLocaleString()}
          />
        </div>

        {/* Progress Bar with White Background */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Funding Progress
            </h3>
            <span className="text-sm font-medium text-blue-600">
              {progressPercentage}% funded
            </span>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-700 mb-1">
              <span>Raised: ${project.raisedAmount.toLocaleString()}</span>
              <span>Target: ${project.targetAmount.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Project Description with White Background */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            About This Project
          </h2>
          <div className="prose max-w-none text-gray-700">
            {project.description.split("\n").map((paragraph, i) => (
              <p key={i} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Statistics Section with White Background */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Project Impact
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <ChartCard title="Age Distribution">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {ageData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Gender Distribution">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {genderData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Health Status">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Beneficiaries">
                    {healthData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Funding Progress">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fundingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(val) => [`$${val.toLocaleString()}`, "Amount"]}
                  />
                  <Bar dataKey="amount" name="Amount">
                    {fundingData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Carousel Gallery with White Background */}
        {media.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Project Gallery
              </h2>
              <span className="text-sm text-gray-500">
                {activeImage + 1} of {media.length}
              </span>
            </div>

            <div className="relative">
              <div className="aspect-video bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={media[activeImage]}
                  alt={`Project visual ${activeImage + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {media.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all"
                  >
                    <FaChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all"
                  >
                    <FaChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            <div className="flex justify-center mt-4 space-x-2">
              {media.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === activeImage ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Partners Section with White Background */}
        {partners.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                Strategic Partners
              </h2>
              <p className="text-gray-500 mt-2">
                Organizations collaborating on this initiative
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {partners.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col items-center p-5 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors duration-200"
                >
                  <div className="h-20 w-full flex items-center justify-center mb-4 p-2 bg-white rounded-md shadow-xs">
                    <img
                      src={`${apiClient.defaults.baseURL}${p.partner_logo}`}
                      alt={p.partner_name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-partner-logo.svg";
                      }}
                    />
                  </div>

                  <div className="text-center">
                    <h3 className="text-gray-800 font-medium mb-1">
                      {p.partner_name}
                    </h3>

                    {p.partner_url && (
                      <a
                        href={p.partner_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        Visit website
                        <FiExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center">
                Partnership logos are displayed with permission
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Donate Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <Link
          to={`/projects/${project.id}/donate`}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl flex items-center justify-center transition-all transform hover:scale-105"
        >
          <FaDonate className="h-6 w-6" />
          <span className="ml-2 font-medium hidden sm:inline">Donate</span>
        </Link>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        project={project}
      />
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-lg p-4 flex items-center border border-gray-200 hover:border-blue-300 transition-colors shadow-sm">
    <div className="mr-4 p-3 bg-gray-50 rounded-full">{icon}</div>
    <div>
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
    <h3 className="text-center font-medium text-gray-700 mb-4">{title}</h3>
    {children}
  </div>
);

export default ProjectDetails;

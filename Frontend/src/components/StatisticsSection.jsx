import React, { useState, useEffect } from "react";
import apiClient from "../hooks/apiClient";
import {
  FaProjectDiagram,
  FaUsers,
  FaDonate,
  FaMapMarkerAlt,
} from "react-icons/fa";

const StatisticsSection = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await apiClient.get("/api/statistics/overview");
        if (data.success) {
          setStatsData(data.data);
        } else {
          throw new Error("Failed to load statistics");
        }
      } catch (err) {
        console.error(err);
        setError("Could not load statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Loading statistics…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 text-center text-red-600">{error}</section>
    );
  }

  // Destructure your API data
  const { activeProjects, totalBeneficiaries, fundsRaised, communitiesServed } =
    statsData;

  // Build the array for display
  const stats = [
    {
      icon: <FaProjectDiagram className="text-3xl" />,
      value: activeProjects.toLocaleString(),
      label: "Active Projects",
      color: "#1598D2",
    },
    {
      icon: <FaUsers className="text-3xl" />,
      value: totalBeneficiaries.toLocaleString(),
      label: "Total Beneficiaries",
      color: "#F4B5AE",
    },
    {
      icon: <FaDonate className="text-3xl" />,
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(fundsRaised),
      label: "Funds Raised",
      color: "#2DC5F2",
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl" />,
      value: communitiesServed.toLocaleString(),
      label: "Communities Served",
      color: "#6BDCF6",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 flex flex-col items-center relative overflow-hidden group hover:shadow-md transition-all"
            >
              {/* Sliding Gradient Border */}
              <div className="absolute left-0 top-0 h-full w-1 overflow-hidden rounded-r-full">
                <div
                  className="h-full w-full animate-border-slide"
                  style={{
                    background: `linear-gradient(to bottom, ${stat.color}, ${stat.color}00)`,
                  }}
                />
              </div>

              <div className="mb-4" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold mb-2 text-gray-800">
                {stat.value}
              </h3>
              <p className="text-lg text-gray-600 text-center">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;

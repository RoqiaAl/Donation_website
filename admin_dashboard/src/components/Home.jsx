import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiGift,
  FiRepeat,
  FiCreditCard,
  FiBriefcase,
  FiUserPlus,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import apiClient from "../hooks/apiClient";

const Home = () => {
  const navigate = useNavigate();
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [stats, setStats] = useState([]);
  const [monthlyDonations, setMonthlyDonations] = useState([]);
  const [donorsByGovernorate, setDonorsByGovernorate] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [topProjects, setTopProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = [
    "#1598D2",
    "#2DC5F2",
    "#6BDCF6",
    "#F4B5AE",
    "#F7CDC7",
    "#A5D8FF",
  ];

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    if (!token || !isAuthenticated) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("isAuthenticated");
      navigate("/", { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          statsResponse,
          monthlyResponse,
          governorateResponse,
          recentResponse,
          topProjectsResponse,
        ] = await Promise.all([
          apiClient.get("/api/admin-dashboard/statistics", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          apiClient.get("/api/admin-dashboard/monthly-donations", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          apiClient.get("/api/admin-dashboard/donors-by-governorate", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          apiClient.get("/api/admin-dashboard/recent", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          apiClient.get("/api/admin-dashboard/top-by-donations", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Extract unique years from monthly donations data
        const years = [
          ...new Set(
            monthlyResponse.data.data.map((item) => parseInt(item.year))
          ),
        ];
        setAvailableYears(years.sort((a, b) => b - a)); // Sort descending

        // Set default year to the most recent year available
        if (years.length > 0 && !years.includes(yearFilter)) {
          setYearFilter(years[0]);
        }

        // Format stats data
        const formattedStats = [
          {
            title: "Total Projects",
            value: statsResponse.data.data?.projects?.toLocaleString() || "0",
            icon: <FiBriefcase size={24} />,
            change: "+0%",
            trend: "up",
          },
          {
            title: "Active Donors",
            value:
              statsResponse.data.data?.activeDonors?.toLocaleString() || "0",
            icon: <FiUsers size={24} />,
            change: "+0%",
            trend: "up",
          },
          {
            title: "Total Donations",
            value: statsResponse.data.data?.donations?.toLocaleString() || "0",
            icon: <FiGift size={24} />,
            change: "+0%",
            trend: "up",
          },
          {
            title: "Recurring Donations",
            value:
              statsResponse.data.data?.recurringDonations?.toLocaleString() ||
              "0",
            icon: <FiRepeat size={24} />,
            change: "+0%",
            trend: "up",
          },
          {
            title: "Transactions",
            value:
              statsResponse.data.data?.transactions?.toLocaleString() || "0",
            icon: <FiCreditCard size={24} />,
            change: "+0%",
            trend: "up",
          },
          {
            title: "Partners",
            value: statsResponse.data.data?.partners?.toLocaleString() || "0",
            icon: <FiUserPlus size={24} />,
            change: "+0%",
            trend: "up",
          },
        ];

        setStats(formattedStats);
        // Filter monthly donations by selected year
        setMonthlyDonations(
          monthlyResponse.data.data.filter(
            (item) => parseInt(item.year) === yearFilter
          )
        );
        setDonorsByGovernorate(governorateResponse.data.data || []);
        setRecentDonations(recentResponse.data.data || []);
        setTopProjects(topProjectsResponse.data.data || []);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("isAuthenticated");
          navigate("/", { replace: true });
        } else {
          setError(err.message);
          console.error("Error fetching dashboard data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [yearFilter, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center p-4">
          <p>Error loading dashboard data</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div className="text-gray-500 text-sm font-medium">
                {stat.title}
              </div>
              <div className="p-2 rounded-lg bg-[#F7F9FC] text-[#1598D2]">
                {stat.icon}
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-gray-800">
                {stat.value}
              </div>
              <div
                className={`text-sm mt-1 flex items-center ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.change} from last month
                <svg
                  className={`w-4 h-4 ml-1 ${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={stat.trend === "up" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Donations Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Monthly Donations
            </h3>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(parseInt(e.target.value))}
              className="text-sm border border-gray-200 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#1598D2]"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyDonations}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="monthName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="totalAmount"
                  fill="#1598D2"
                  name="Donation Amount"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="donationCount"
                  fill="#6BDCF6"
                  name="Donation Count"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donors by Governorate Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Donors by Governorate
          </h3>
          <div className="h-80">
            {donorsByGovernorate.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donorsByGovernorate}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="donorCount"
                    nameKey="governorate"
                    label={({ governorate, percent }) =>
                      `${governorate}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {donorsByGovernorate.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} donors`, "Count"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No donor data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Projects */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Top Projects by Donations
          </h3>
          <div className="space-y-3">
            {topProjects.length > 0 ? (
              topProjects.map((project, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{project.projectName}</span>
                    <span className="text-gray-600">
                      {project.totalDonations?.toLocaleString()} $
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#1598D2] h-2 rounded-full"
                      style={{
                        width: `${
                          (project.totalDonations /
                            Math.max(
                              ...topProjects.map((p) => p.totalDonations || 1)
                            )) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {project.donationCount} donation
                    {project.donationCount !== 1 ? "s" : ""}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">
                No project data available
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Donations
          </h3>
          <div className="space-y-3">
            {recentDonations.length > 0 ? (
              recentDonations.map((donation, index) => (
                <div
                  key={index}
                  className="flex items-start pb-3 border-b border-gray-100 last:border-0"
                >
                  <div className="p-2 bg-[#F7F9FC] rounded-lg mr-3 text-[#1598D2]">
                    <FiGift size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{donation.donorName}</span>
                      <span className="text-[#1598D2] font-semibold">
                        {donation.amount} $
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {donation.projectName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {donation.donationTimeAgo}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">
                No recent donations
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

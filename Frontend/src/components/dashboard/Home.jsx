import { useState, useEffect } from "react";
import apiClient from "../../hooks/apiClient";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { jwtDecode } from "jwt-decode";

// Register ChartJS components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend
);

export default function Home() {
  const [stats, setStats] = useState(null);
  const [donations, setDonations] = useState([]);
  const [donationHistoryData, setDonationHistoryData] = useState({});
  const [donationsByLocation, setDonationsByLocation] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2025"); // Default to current year
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const availableYears = ["2025", "2024", "2023", "2022", "2021"];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1️⃣ Detect JWT in localStorage
        const token = localStorage.getItem("token");
        const isAuthenticated = Boolean(token);

        if (!isAuthenticated) {
          throw new Error("Authentication required");
        }

        // Set authorization header
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Extract donor_id from token
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        const donorId = decoded.id; // Adjust based on your token structu

        if (!donorId) {
          throw new Error("Donor ID not found in token");
        }

        // Fetch statistics
        const statsResponse = await apiClient.get(
          `/api/donor-dashboard/dashboard-statistics/${donorId}`
        );
        setStats(statsResponse.data);
        console.log("Stats data:", statsResponse.data);

        // Fetch donations data
        const donationsResponse = await apiClient.get(
          `/api/donor-dashboard/donations-charts/${donorId}`
        );
        const donationsData = donationsResponse.data;
        console.log("Donations data:", donationsData);

        // Process donations data
        setDonations(donationsData || []);

        // Group donations by year
        const groupedByYear = {};
        donationsData.forEach((donation) => {
          const year = new Date(donation.donation_date)
            .getFullYear()
            .toString();
          if (!groupedByYear[year]) {
            groupedByYear[year] = [];
          }
          groupedByYear[year].push({
            date: donation.donation_date,
            amount: donation.amount,
            project: donation.projectName,
          });
        });
        setDonationHistoryData(groupedByYear);

        // Group donations by location (using governate)
        const groupedByLocation = {};
        donationsData.forEach((donation) => {
          const location = donation.governate || "Unknown";
          groupedByLocation[location] =
            (groupedByLocation[location] || 0) + donation.amount;
        });

        setDonationsByLocation({
          labels: Object.keys(groupedByLocation),
          datasets: [
            {
              data: Object.values(groupedByLocation),
              backgroundColor: [
                "#6366F1",
                "#A5B4FC",
                "#C7D2FE",
                "#E0E7FF",
                "#C4B5FD",
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare chart data
  const historyChartData = {
    labels:
      donationHistoryData[selectedYear]?.map((item) =>
        new Date(item.date).toLocaleDateString()
      ) || [],
    datasets: [
      {
        label: "Donation Amount ($)",
        data:
          donationHistoryData[selectedYear]?.map((item) => item.amount) || [],
        backgroundColor: "#6366F1",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Amount ($)" },
      },
      x: {
        title: { display: true, text: "Donation Date" },
      },
    },
  };

  const filteredDonations = donations.filter((d) => {
    const searchLower = search.toLowerCase();
    return (
      (d.projectName?.toLowerCase().includes(searchLower) ||
        d.donation_date?.includes(search)) &&
      (filter === "all" || d.projectName === filter)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Donated"
          value={`$${stats?.totalAmount?.toLocaleString() || "0"}`}
          icon="💰"
        />
        <StatCard
          label="Average Donation"
          value={`$${stats?.averageAmount?.toLocaleString() || "0"}`}
          icon="📊"
        />
        <StatCard
          label="Projects Supported"
          value={stats?.numberOfProjects?.toLocaleString() || "0"}
          icon="🎯"
        />
        <StatCard
          label="Active Recurring"
          value={stats?.recurringDonationsCount?.toLocaleString() || "0"}
          icon="🔄"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation History Chart */}
        <ChartCard
          title={
            <div className="flex justify-between items-center">
              <span>Donation History</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="p-2 border rounded-md text-sm"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          }
        >
          {donationHistoryData[selectedYear]?.length > 0 ? (
            <Bar data={historyChartData} options={chartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No donations found for {selectedYear}
            </div>
          )}
        </ChartCard>

        {/* Donations by Location Chart */}
        <ChartCard title="My Donations by Location">
          {donationsByLocation ? (
            <Pie data={donationsByLocation} options={chartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No location data available
            </div>
          )}
        </ChartCard>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row justify-between gap-3">
          <h2 className="text-lg font-semibold">Recent Donations</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Search projects or dates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border rounded-md flex-1"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="all">All Projects</option>
              {[...new Set(donations.map((d) => d.projectName))].map(
                (project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonations.length > 0 ? (
                filteredDonations.map((donation, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {donation.projectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${donation.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(donation.donation_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {donations.length === 0
                      ? "No donations found"
                      : "No donations match your search"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center">
        <span className="text-2xl mr-3">{icon}</span>
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Reusable Chart Wrapper
function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm h-64">
      {typeof title === "string" ? (
        <h3 className="font-medium mb-4">{title}</h3>
      ) : (
        <div className="mb-4">{title}</div>
      )}
      <div className="h-48">{children}</div>
    </div>
  );
}

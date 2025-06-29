import { useState, useEffect } from "react";
import apiClient from "../../hooks/apiClient";
import { jwtDecode } from "jwt-decode";

// Status mapping based on your numbers
const statusMapping = {
  approved: 4,
  stopped: 5,
  cancelled: 6,
};

// Reverse mapping for display purposes
const statusDisplayMap = {
  4: "approved",
  5: "stopped",
  6: "cancelled",
};

export default function RecurringDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donorId, setDonorId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDonorId(decoded.donorId || decoded.id);
      } catch (err) {
        console.error("Error decoding token:", err);
        setError("Failed to authenticate");
        setLoading(false);
      }
    } else {
      setError("No authentication token found");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!donorId) return;

    const fetchRecurringDonations = async () => {
      try {
        const response = await apiClient.get(
          `/api/donor-dashboard/recurring-donations/${donorId}`
        );
        // Convert status numbers to strings for display
        const donationsWithStatus = response.data.map((donation) => ({
          ...donation,
          recurring_donation_status:
            statusDisplayMap[donation.recurring_donation_status] ||
            donation.recurring_donation_status,
        }));
        setDonations(donationsWithStatus);
      } catch (err) {
        console.error("Error fetching recurring donations:", err);
        setError("Failed to load recurring donations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecurringDonations();
  }, [donorId]);

  const updateStatus = async (id, newStatus) => {
    try {
      // Get the numeric status ID from our mapping
      const newStatusId = statusMapping[newStatus];

      // Call API with the correct body parameter name
      await apiClient.put(
        `/api/donor-dashboard/recurring-donations/${id}/status`,
        { newStatusId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update local state with the string status for display
      setDonations(
        donations.map((d) =>
          d.id === id ? { ...d, recurring_donation_status: newStatus } : d
        )
      );
    } catch (err) {
      console.error("Error updating donation status:", err);
      setError(
        `Failed to update donation status: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getIntervalFromDates = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    if (diffInMonths === 1) return "Monthly";
    if (diffInMonths === 3) return "Quarterly";
    if (diffInMonths === 12) return "Yearly";
    return `${diffInMonths} months`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return { bg: "bg-green-100", text: "text-green-800" };
      case "stopped":
        return { bg: "bg-yellow-100", text: "text-yellow-800" };
      case "cancelled":
        return { bg: "bg-red-100", text: "text-red-800" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800" };
    }
  };

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
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <p className="text-gray-500">No recurring donations found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Recurring Donations</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Interval
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Payment Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Next Donation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donations.map((donation) => {
              const statusColor = getStatusColor(
                donation.recurring_donation_status
              );
              return (
                <tr key={donation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${donation.interval_amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getIntervalFromDates(
                      donation.start_date,
                      donation.end_date
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    {donation.payment_method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(donation.next_donation_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${statusColor.bg} ${statusColor.text}`}
                    >
                      {donation.recurring_donation_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    {donation.recurring_donation_status === "approved" && (
                      <>
                        <button
                          onClick={() => updateStatus(donation.id, "stopped")}
                          className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        >
                          Stop
                        </button>
                        <button
                          onClick={() => updateStatus(donation.id, "cancelled")}
                          className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800 hover:bg-red-200"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {donation.recurring_donation_status === "stopped" && (
                      <>
                        <button
                          onClick={() => updateStatus(donation.id, "approved")}
                          className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 hover:bg-green-200"
                        >
                          Resume
                        </button>
                        <button
                          onClick={() => updateStatus(donation.id, "cancelled")}
                          className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800 hover:bg-red-200"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

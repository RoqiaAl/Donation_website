import { useState, useEffect } from "react";
import apiClient from "../../hooks/apiClient";
import { jwtDecode } from "jwt-decode";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donorId, setDonorId] = useState(null);

  const statusColors = {
    Success: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Failed: "bg-red-100 text-red-800",
  };

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

    const fetchTransactions = async () => {
      try {
        const response = await apiClient.get(
          `/api/donor-dashboard/${donorId}/transactions`
        );

        if (response.data.success) {
          setTransactions(response.data.data);
        } else {
          throw new Error("Failed to fetch transactions");
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError(err.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [donorId]);

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

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <p className="text-gray-500">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Transaction History</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Donation ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Transaction Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Payment Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((txn) => (
              <tr key={txn.donation_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  #{txn.donation_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {txn.transaction_code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">
                  {txn.payment_method}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      statusColors[txn.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

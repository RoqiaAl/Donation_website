// src/components/donor/dashboard/DonationsPage.jsx
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import "./dashboard.css";

const DonationsPage = ({ donations }) => {
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  // Prepare chart data
  const monthlyDonations = Array(12).fill(0);
  donations
    .filter((d) => new Date(d.date).getFullYear() === yearFilter)
    .forEach((d) => {
      const month = new Date(d.date).getMonth();
      monthlyDonations[month] += d.amount;
    });

  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Donations",
        data: monthlyDonations,
        backgroundColor: "#4e73df",
        borderColor: "#2e59d9",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="donations-page">
      <div className="page-header">
        <h2>My Donations</h2>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(parseInt(e.target.value))}
          className="year-filter"
        >
          {[2024, 2023, 2022].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="chart-container">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => `$${value.toLocaleString()}`,
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => ` $${context.raw.toLocaleString()}`,
                },
              },
            },
          }}
        />
      </div>

      <div className="table-container">
        <table className="donations-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Transaction Code</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id}>
                <td>{new Date(donation.date).toLocaleDateString()}</td>
                <td>${donation.amount.toLocaleString()}</td>
                <td>{donation.paymentMethod}</td>
                <td>
                  <span
                    className={`status-badge ${donation.status.toLowerCase()}`}
                  >
                    {donation.status}
                  </span>
                </td>
                <td>{donation.transactionCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationsPage;

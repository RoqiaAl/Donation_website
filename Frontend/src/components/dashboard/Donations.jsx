import { useState } from "react";

export default function Donations() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Sample data - replace with API call
  const donations = [
    { id: 1, project: "Education Fund", amount: 100, date: "2023-05-01" },
    { id: 2, project: "Healthcare", amount: 50, date: "2023-04-15" },
    // Add more data...
  ];

  const filteredDonations = donations.filter((d) => {
    const matchesSearch = d.project
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = filter === "all" || d.project === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b flex flex-col md:flex-row justify-between gap-3">
        <h2 className="text-lg font-semibold">Your Donations</h2>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded-md"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All Projects</option>
            {[...new Set(donations.map((d) => d.project))].map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
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
            {filteredDonations.map((donation) => (
              <tr key={donation.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {donation.project}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${donation.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{donation.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

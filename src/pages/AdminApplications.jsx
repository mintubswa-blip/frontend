/** @format */

import React, { useState, useEffect } from "react";

const AdminApplications = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    agent: "",
  });
  const [page, setPage] = useState(1);
  const perPage = 5;

  // Toggle Dropdown
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Logout
  const logout = () => {
    alert("Logged out successfully!");
  };

  // Apply Filters
  const applyFilters = () => {
    alert("Filters applied: " + JSON.stringify(filters));
  };

  // Export
  const exportApplications = () => {
    alert("Exporting applications...");
  };

  // ✅ Load Applications from Backend
  const loadApplications = async () => {
    try {
      const res = await fetch("http://localhost:5000/getApplication");
      const data = await res.json();

      if (data.success) {
        // map backend data to frontend structure
        const formatted = data.data.map((app, idx) => ({
          number: `APP${String(idx + 1).padStart(3, "0")}`, // application no.
          name: app.fullName,
          phone: app.mobileNumber,
          location: `${app.city || ""}, ${app.state || ""}`,
          agent: app.agentId || "N/A",
          status: app.status || "Pending",
          date: new Date(app.createdAt).toLocaleDateString(),
          _id: app._id,
        }));

        setApplications(formatted);
      } else {
        console.error("Failed to fetch applications:", data.message);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  // Fetch on mount
  useEffect(() => {
    loadApplications();
  }, []);

  // Pagination
  const totalPages = Math.ceil(applications.length / perPage);
  const startIdx = (page - 1) * perPage;
  const paginatedApps = applications.slice(startIdx, startIdx + perPage);

  return (
    <>
      {/* HEADER */}
      <header className="bg-blue-600 shadow-md py-4 px-6 flex items-center justify-between text-white">
        <div className="flex items-center space-x-4">
          <img
            src="https://registrations-meesho-valmo.in/valmologo.png"
            alt="VALMO"
            className="h-8"
          />
          <h1 className="text-xl font-bold">Applications Management</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="text-white hover:text-blue-200 flex items-center"
            >
              <i className="fas fa-bars mr-2" />
              Menu
              <i className="fas fa-chevron-down ml-2" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <div className="py-1">
                  <a
                    href="/admin/admin-home.html"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <i className="fas fa-home mr-2" />
                    Home
                  </a>
                  <a
                    href="/admin/admin-agent-management.html"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <i className="fas fa-users mr-2" />
                    Add Agent
                  </a>
                  <a
                    href="/admin/admin-applications.html"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 bg-blue-50"
                  >
                    <i className="fas fa-file-alt mr-2" />
                    Applications
                  </a>
                  <a
                    href="/admin/admin-bank-details.html"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <i className="fas fa-university mr-2" />
                    Bank Details
                  </a>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            <i className="fas fa-sign-out-alt mr-2" />
            Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <i className="fas fa-file-alt text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Total Applications
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {applications.length}
                </p>
              </div>
            </div>
          </div>
          {/* Pending */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <i className="fas fa-clock text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {applications.filter((a) => a.status === "Pending").length}
                </p>
              </div>
            </div>
          </div>
          {/* Approved */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <i className="fas fa-check-circle text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Approved
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {applications.filter((a) => a.status === "Approved").length}
                </p>
              </div>
            </div>
          </div>
          {/* Rejected */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <i className="fas fa-times-circle text-red-600 text-xl" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Rejected
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  {applications.filter((a) => a.status === "Rejected").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-blue-600">
              <i className="fas fa-list mr-2" />
              All Applications
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={exportApplications}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                <i className="fas fa-download mr-2" />
                Export
              </button>
              <button
                onClick={loadApplications}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <i className="fas fa-refresh mr-2" />
                Refresh
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">
                    Application No.
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">
                    Applicant Name
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">
                    Phone
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">
                    Location
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">
                    Agent
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedApps.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  paginatedApps.map((app, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-3 px-4">{app.number}</td>
                      <td className="py-3 px-4">{app.name}</td>
                      <td className="py-3 px-4">{app.phone}</td>
                      <td className="py-3 px-4">{app.location}</td>
                      <td className="py-3 px-4">{app.agent}</td>
                      <td className="py-3 px-4">{app.status}</td>
                      <td className="py-3 px-4">{app.date}</td>
                      <td className="py-3 px-4">
                        <button className="text-blue-500 hover:text-blue-700 mr-2">
                          View
                        </button>
                        <button className="text-green-500 hover:text-green-700 mr-2">
                          Approve
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {startIdx + 1} to{" "}
              {Math.min(startIdx + perPage, applications.length)} of{" "}
              {applications.length} applications
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1 border rounded hover:bg-gray-50"
                disabled={page === 1}
              >
                <i className="fas fa-chevron-left" />
              </button>
              <span className="px-3 py-1">
                Page {page} of {totalPages || 1}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-3 py-1 border rounded hover:bg-gray-50"
                disabled={page === totalPages || totalPages === 0}
              >
                <i className="fas fa-chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-6 mt-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-xs">© 2025 Valmo. All rights reserved.</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AdminApplications;

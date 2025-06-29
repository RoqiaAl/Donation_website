import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FiHome,
  FiUser,
  FiDollarSign,
  FiRefreshCw,
  FiCreditCard,
  FiMenu,
  FiX,
} from "react-icons/fi";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeRoute, setActiveRoute] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch token and decode user info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);

        // Handle both username and user_name cases
        setUserName(decoded.username || decoded.user_name || "User");
      } catch (err) {
        console.error("Error decoding token:", err);
        setError("Failed to authenticate");
      }
    } else {
      setError("No authentication token found");
      navigate("/login");
    }
  }, [navigate]);

  // Track active route
  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    setActiveRoute(pathSegments[pathSegments.length - 1] || "");
  }, [location]);

  // Toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { path: "", icon: <FiHome size={20} />, label: "Dashboard" },
    { path: "profile", icon: <FiUser size={20} />, label: "Profile" },
    { path: "recurring", icon: <FiRefreshCw size={20} />, label: "Recurring" },
    {
      path: "transactions",
      icon: <FiCreditCard size={20} />,
      label: "Transactions",
    },
  ];

  return (
    <div className="flex h-screen bg-[#F7F9FC] overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-30 w-64 h-full bg-gradient-to-b from-[#1598D2] to-[#2DC5F2] text-white transition-all duration-300 ease-in-out transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8">
            <Link to="" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <span className="text-[#1598D2] font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold">DonorDash</span>
            </Link>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1 rounded-md hover:bg-[#6BDCF6]"
              aria-label="Close sidebar"
            >
              <FiX size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path || "dashboard"}
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  activeRoute === item.path
                    ? "bg-white text-[#1598D2] font-medium"
                    : "hover:bg-[#6BDCF6] hover:bg-opacity-30"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#6BDCF6] border-opacity-30">
            <div className="text-xs opacity-75">
              © {new Date().getFullYear()} GiveHope
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 mr-2 rounded-md hover:bg-[#F7CDC7] text-[#1598D2]"
                aria-label="Open sidebar"
              >
                <FiMenu size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-800 capitalize">
                {navItems.find((item) => item.path === activeRoute)?.label ||
                  "Dashboard"}
              </h1>
            </div>

            {/* User Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-[#F4B5AE] flex items-center justify-center text-white font-medium">
                  {userName?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="hidden md:inline text-gray-700">
                  {userName || "User"}
                </span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  to="profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F7CDC7]"
                >
                  Your Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#F7CDC7]"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#F7F9FC]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

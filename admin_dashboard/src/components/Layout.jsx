import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FiHome,
  FiUsers,
  FiLock,
  FiBox,
  FiGift,
  FiCreditCard,
  FiMail,
  FiStar,
  FiBarChart2,
  FiMenu,
  FiX,
  FiLayers,
  FiBriefcase,
  FiMessageSquare,
  FiHeart,
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
    const token = localStorage.getItem("authToken");
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    if (!token || !isAuthenticated) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("isAuthenticated");
      navigate("/", { replace: true });
    } else {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.email || "Admin");
      } catch (err) {
        console.error("Error decoding token:", err);
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAuthenticated");
        navigate("/", { replace: true });
      }
    }
  }, [navigate, location]);

  // Track active route
  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    setActiveRoute(pathSegments[pathSegments.length - 1] || "");
  }, [location]);

  // Toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAuthenticated");
    navigate("/", { replace: true });
  };

  const navItems = [
    // Main Dashboard
    {
      path: "",
      icon: <FiHome size={20} />,
      label: "Dashboard",
      exact: true,
    },

    // User Administration
    {
      label: "User Management",
      icon: <FiUsers size={20} />,
      subItems: [
        { path: "users", label: "Users", icon: <FiUsers size={16} /> },
        { path: "donors", label: "Donors", icon: <FiHeart size={16} /> },
        { path: "partners", label: "Partners", icon: <FiUsers size={16} /> },
      ],
    },

    // Project Administration
    {
      label: "Project Management",
      icon: <FiLayers size={20} />,
      subItems: [
        {
          path: "projects",
          label: "Projects",
          icon: <FiBriefcase size={16} />,
        },

        { path: "media", label: "Media & partners", icon: <FiBox size={16} /> },
      ],
    },

    // Donation Administration
    {
      label: "Donation Management",
      icon: <FiGift size={20} />,
      subItems: [
        {
          path: "donations",
          label: "Donations",
          icon: <FiGift size={16} />,
        },
        {
          path: "transactions",
          label: "Transactions",
          icon: <FiCreditCard size={16} />,
        },
        {
          path: "recurring-donations",
          label: "Recurring Donations",
          icon: <FiGift size={16} />,
        },
      ],
    },

    // Engagement
    {
      label: "Engagement",
      icon: <FiMail size={20} />,
      subItems: [
        { path: "reviews", label: "Reviews", icon: <FiStar size={16} /> },
      ],
    },

    // Reports
    {
      path: "reports",
      icon: <FiBarChart2 size={20} />,
      label: "Reports",
    },
  ];

  const isActive = (path) => {
    if (path === "") return location.pathname === "/dashboard";
    return activeRoute === path;
  };

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

          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.subItems ? (
                  <details className="group">
                    <summary
                      className={`flex items-center p-3 rounded-lg cursor-pointer ${
                        item.subItems.some((sub) => isActive(sub.path))
                          ? "bg-white text-[#1598D2] font-medium"
                          : "hover:bg-[#6BDCF6] hover:bg-opacity-30"
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span className="flex-1 font-semibold">{item.label}</span>
                      <svg
                        className="w-4 h-4 transition-transform group-open:rotate-90"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </summary>
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`flex items-center p-2 rounded-lg text-sm transition-colors ${
                            isActive(subItem.path)
                              ? "bg-[#F7CDC7] text-[#1598D2] font-medium"
                              : "hover:bg-[#6BDCF6] hover:bg-opacity-30"
                          }`}
                        >
                          <span className="mr-2">{subItem.icon}</span>
                          <span className="font-medium">{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-white text-[#1598D2] font-medium"
                        : "hover:bg-[#6BDCF6] hover:bg-opacity-30"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#6BDCF6] border-opacity-30">
            <div className="text-xs opacity-75">
              © {new Date().getFullYear()} DonorDash
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
                {navItems.find((item) => isActive(item.path))?.label ||
                  navItems
                    .flatMap((item) =>
                      item.subItems?.find((sub) => isActive(sub.path))
                    )
                    .find(Boolean)?.label ||
                  "Dashboard"}
              </h1>
            </div>

            {/* User Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-[#F4B5AE] flex items-center justify-center text-white font-medium">
                  {userName?.charAt(0).toUpperCase() || "A"}
                </div>
                <span className="hidden md:inline text-gray-700 font-medium">
                  {userName || "Admin"}
                </span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#F7CDC7] font-medium"
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

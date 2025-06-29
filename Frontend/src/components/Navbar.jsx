import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // On mount, check for token
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
    setIsOpen(false);
  };

  return (
    <nav className="bg-[#1598D2] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="flex items-center"
              onClick={closeAllDropdowns}
            >
              <svg
                className="h-10 w-10 text-[#F4B5AE]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2 text-2xl font-bold text-white">
                Give<span className="text-[#F4B5AE]">Hope</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              <Link
                to="/"
                className="text-white hover:text-[#F7CDC7] px-3 py-2 rounded-md text-lg font-medium transition-colors"
                onClick={closeAllDropdowns}
              >
                Home
              </Link>

              {/* About */}
              <div className="relative">
                <button
                  className="text-white hover:text-[#F7CDC7] px-3 py-2 rounded-md text-lg font-medium flex items-center transition-colors"
                  onClick={() => toggleDropdown("about")}
                  onMouseEnter={() => setActiveDropdown("about")}
                >
                  About
                  <svg
                    className="w-4 h-4 inline ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`absolute ${
                    activeDropdown === "about" ? "block" : "hidden"
                  } bg-white shadow-lg rounded-md mt-2 w-48 z-10`}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to="/about/goals"
                    className="block px-4 py-2 text-[#1598D2] hover:bg-[#F7CDC7]"
                    onClick={closeAllDropdowns}
                  >
                    Goals
                  </Link>
                  <Link
                    to="/about/vision"
                    className="block px-4 py-2 text-[#1598D2] hover:bg-[#F7CDC7]"
                    onClick={closeAllDropdowns}
                  >
                    Vision
                  </Link>
                  <Link
                    to="/about"
                    className="block px-4 py-2 text-[#1598D2] hover:bg-[#F7CDC7]"
                    onClick={closeAllDropdowns}
                  >
                    About Us
                  </Link>
                </div>
              </div>

              {/* Contact */}
              <div className="relative">
                <button
                  className="text-white hover:text-[#F7CDC7] px-3 py-2 rounded-md text-lg font-medium flex items-center transition-colors"
                  onClick={() => toggleDropdown("contact")}
                  onMouseEnter={() => setActiveDropdown("contact")}
                >
                  Contact
                  <svg
                    className="w-4 h-4 inline ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`absolute ${
                    activeDropdown === "contact" ? "block" : "hidden"
                  } bg-white shadow-lg rounded-md mt-2 w-48 z-10`}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to="/contact/subscribe"
                    className="block px-4 py-2 text-[#1598D2] hover:bg-[#F7CDC7]"
                    onClick={closeAllDropdowns}
                  >
                    Subscribe
                  </Link>
                  <Link
                    to="/contact"
                    className="block px-4 py-2 text-[#1598D2] hover:bg-[#F7CDC7]"
                    onClick={closeAllDropdowns}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>

              {/* Testimonials */}
              <div className="relative">
                <button
                  className="text-white hover:text-[#F7CDC7] px-3 py-2 rounded-md text-lg font-medium flex items-center transition-colors"
                  onClick={() => toggleDropdown("testimonials")}
                  onMouseEnter={() => setActiveDropdown("testimonials")}
                >
                  Testimonials
                  <svg
                    className="w-4 h-4 inline ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`absolute ${
                    activeDropdown === "testimonials" ? "block" : "hidden"
                  } bg-white shadow-lg rounded-md mt-2 w-48 z-10`}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to="/testimonials/reviews"
                    className="block px-4 py-2 text-[#1598D2] hover:bg-[#F7CDC7]"
                    onClick={closeAllDropdowns}
                  >
                    Reviews
                  </Link>
                  <Link
                    to="/testimonials/create"
                    className="block px-4 py-2 text-[#1598D2] hover:bg-[#F7CDC7]"
                    onClick={closeAllDropdowns}
                  >
                    Create Review
                  </Link>
                </div>
              </div>

              <Link
                to="/projects"
                className="text-white hover:text-[#F7CDC7] px-3 py-2 rounded-md text-lg font-medium transition-colors"
                onClick={closeAllDropdowns}
              >
                Projects
              </Link>

              {/* Authenticated vs Guest Links */}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-white hover:text-[#F7CDC7] px-3 py-2 rounded-md text-lg font-medium transition-colors"
                    onClick={closeAllDropdowns}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-[#F7CDC7] px-3 py-2 rounded-md text-lg font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex space-x-4 ml-4">
                  <Link
                    to="/login"
                    className="bg-white hover:bg-[#F7CDC7] text-[#1598D2] font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300 border-2 border-white"
                    onClick={closeAllDropdowns}
                  >
                    Login
                  </Link>
                  <Link
                    to="/donate"
                    className="bg-[#F4B5AE] hover:bg-[#F7CDC7] text-[#1598D2] font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-300"
                    onClick={closeAllDropdowns}
                  >
                    Donate Now
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-[#F4B5AE]"
            >
              <svg
                className={`h-8 w-8 ${isOpen ? "hidden" : "block"}`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`h-8 w-8 ${isOpen ? "block" : "hidden"}`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#6BDCF6]">
          <Link
            to="/"
            className="text-[#1598D2] hover:bg-[#2DC5F2] hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            onClick={closeAllDropdowns}
          >
            Home
          </Link>

          {/* About Mobile */}
          <div className="relative">
            <button
              className="w-full text-left text-[#1598D2] hover:bg-[#2DC5F2] hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => toggleDropdown("aboutMobile")}
            >
              About
            </button>
            <div
              className={`pl-4 ${
                activeDropdown === "aboutMobile" ? "block" : "hidden"
              }`}
            >
              <Link
                to="/about/goals"
                className="block px-3 py-2 text-sm text-[#1598D2] hover:bg-[#2DC5F2] hover:text-white rounded-md"
                onClick={closeAllDropdowns}
              >
                Goals
              </Link>
              <Link
                to="/about/vision"
                className="block px-3 py-2 text-sm text-[#1598D2] hover:bg-[#2DC5F2] hover:text-white rounded-md"
                onClick={closeAllDropdowns}
              >
                Vision
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-sm text-[#1598D2] hover:bg-[#2DC5F2] hover:text-white rounded-md"
                onClick={closeAllDropdowns}
              >
                About Us
              </Link>
            </div>
          </div>

          {/* Contact Mobile */}
          <div className="relative">
            <button
              className="w-full text-left text-[#1598D2] hover:bg-[#2DC5F2] hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => toggleDropdown("contactMobile")}
            >
              Contact
            </button>
            <div
              className={`pl-4 ${
                activeDropdown === "contactMobile" ? "block" : "hidden"
              }`}
            >
              <Link
                to="/contact/subscribe"
                className="block px-3 py-2 text-sm text-[#1598D2] hover:bg-[#2DC5F2] hover:text-white rounded-md"
                onClick={closeAllDropdowns}
              >
                Subscribe
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-sm text-[#1598D2] hover:bg-[#2DC5F2] hover:text-white rounded-md"
                onClick={closeAllDropdowns}
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Testimonials Mobile */}
          <div className="relative">
            <button
              className="w-full text-left text-[#1598D2] hover:bg-[#2DC5F2] hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => toggleDropdown("testimonialsMobile")}
            >
              Testimonials
            </button>
            <div
              className={`pl-4 ${
                activeDropdown === "testimonialsMobile" ? "block" : "hidden"
              }`}
            >
              <Link
                to="/testimonials/reviews"
                className="block px-3 py-2 text-sm text-[#1598D2] hover:bg-[#2DC5F2] hover:text-white rounded-md"
                onClick={closeAllDropdowns}
              >
                Reviews
              </Link>
              <Link
                to="/testimonials/create"
                className="block px-3 py-2 text-sm text-[#1598D2] hover:bg-[#2DC5F2] hover:text-white rounded-md"
                onClick={closeAllDropdowns}
              >
                Create Review
              </Link>
            </div>
          </div>

          <Link
            to="/projects"
            className="text-[#1598D2] hover:bg-[#2DC5F2] hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            onClick={closeAllDropdowns}
          >
            Projects
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-[#1598D2] hover:bg-[#2DC5F2] hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={closeAllDropdowns}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-[#1598D2] hover:bg-[#2DC5F2] hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="text-[#1598D2] hover:bg-[#2DC5F2] hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={closeAllDropdowns}
              >
                Register
              </Link>
              <Link
                to="/login"
                className="text-[#1598D2] hover:bg-[#2DC5F2] hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={closeAllDropdowns}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

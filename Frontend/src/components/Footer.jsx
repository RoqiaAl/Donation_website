import React, { useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <footer className="bg-[#1598D2] text-white relative z-10">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Branding & Social */}
        <div className="space-y-4">
          <h2 className="flex items-baseline text-2xl font-bold">
            <span>Give</span>
            <span className="text-[#F4B5AE] ml-1">Hope</span>
          </h2>
          <p className="leading-relaxed">
            Empowering communities through charitable donations and volunteer work.
          </p>
          <div className="flex space-x-3">
            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label={Icon.name}
                className="p-2 bg-white text-[#1598D2] rounded-full hover:bg-[#F4B5AE] hover:text-white transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* About Section (matches navbar) */}
        <div className="relative">
          <button
            className="text-xl font-semibold mb-2 flex items-center"
            onClick={() => toggleDropdown("about")}
            onMouseEnter={() => setActiveDropdown("about")}
          >
            About
            <svg
              className={`w-4 h-4 ml-1 transition-transform ${
                activeDropdown === "about" ? "rotate-180" : ""
              }`}
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
          <ul
            className={`space-y-2 ${
              activeDropdown === "about" ? "block" : "hidden"
            } md:block`}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <li>
              <Link to="/about/goals" className="hover:text-[#F7CDC7] transition">
                Goals
              </Link>
            </li>
            <li>
              <Link to="/about/vision" className="hover:text-[#F7CDC7] transition">
                Vision
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#F7CDC7] transition">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Section (matches navbar) */}
        <div className="relative">
          <button
            className="text-xl font-semibold mb-2 flex items-center"
            onClick={() => toggleDropdown("contact")}
            onMouseEnter={() => setActiveDropdown("contact")}
          >
            Contact
            <svg
              className={`w-4 h-4 ml-1 transition-transform ${
                activeDropdown === "contact" ? "rotate-180" : ""
              }`}
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
          <ul
            className={`space-y-2 ${
              activeDropdown === "contact" ? "block" : "hidden"
            } md:block`}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <li>
              <Link to="/contact/subscribe" className="hover:text-[#F7CDC7] transition">
                Subscribe
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#F7CDC7] transition">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Testimonials & Projects (matches navbar) */}
        <div className="space-y-6">
          <div className="relative">
            <button
              className="text-xl font-semibold mb-2 flex items-center"
              onClick={() => toggleDropdown("testimonials")}
              onMouseEnter={() => setActiveDropdown("testimonials")}
            >
              Testimonials
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${
                  activeDropdown === "testimonials" ? "rotate-180" : ""
                }`}
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
            <ul
              className={`space-y-2 ${
                activeDropdown === "testimonials" ? "block" : "hidden"
              } md:block`}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <li>
                <Link to="/testimonials/reviews" className="hover:text-[#F7CDC7] transition">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/testimonials/create" className="hover:text-[#F7CDC7] transition">
                  Create Review
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <Link to="/projects" className="text-xl font-semibold hover:text-[#F7CDC7] transition">
              Projects
            </Link>
          </div>

          <div>
            <Link to="/donate" className="bg-[#F4B5AE] hover:bg-[#F7CDC7] text-[#1598D2] font-bold py-2 px-4 rounded-full inline-block transition">
              Donate Now
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <p className="text-center text-sm py-6">
          © {year} GiveHope. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
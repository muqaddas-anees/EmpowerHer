import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Navbar({ isAuthenticated, logout }) {
  const location = useLocation(); // Get the current location (path)
  const { user } = useAuth();

  return (
    <div className="bg-[#86469C] text-white  container px-6 py-3 md:px-40 shadow-lg h-16 fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl cursor-pointer font-bold  transition-colors duration-300">
          Empower<span className="text-3xl text-[#BC7FCD]">Her</span>
        </h1>
        <div className="flex space-x-6">
          {/* Links with active class logic */}
          <Link
            to="/seller"
            className={`mt-1 text-xl cursor-pointer font-bold transition-all duration-300 ${
              location.pathname === "/seller"
                ? "text-[#BC7FCD] scale-110"
                : "hover:text-[#2a1031]"
            }`}
          >
            Seller
          </Link>
          <Link
            to="/about"
            className={`mt-1 text-xl cursor-pointer font-bold transition-all duration-300 ${
              location.pathname === "/about"
                ? "text-[#BC7FCD] scale-110"
                : "hover:text-[#BC7FCD]"
            }`}
          >
            About Us
          </Link>
          <Link
            to="/consumer"
            className={`mt-1 text-xl cursor-pointer font-bold transition-all duration-300 ${
              location.pathname === "/consumer"
                ? "text-[#BC7FCD] scale-110"
                : "hover:text-[#BC7FCD]"
            }`}
          >
            Consumer
          </Link>
          <Link
            to="/contact"
            className={`mt-1 text-xl cursor-pointer font-bold transition-all duration-300 ${
              location.pathname === "/contact"
                ? "text-[#BC7FCD] scale-110"
                : "hover:text-[#BC7FCD]"
            }`}
          >
            Contact
          </Link>

          {user?.isAdmin && (
            <Link
              to="/admin"
              className={`mt-1 text-xl cursor-pointer font-bold transition-all duration-300 ${
                location.pathname === "/admin"
                  ? "text-[#BC7FCD] scale-110"
                  : "hover:text-[#BC7FCD]"
              }`}
            >
              Admin
            </Link>
          )}
          <div className="space-x-4">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="p-3 rounded-lg font-semibold transition-all duration-300 ease-in-out
                   bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg
                   hover:from-red-700 hover:to-red-500 hover:scale-110 hover:shadow-2xl
                   focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="text-white"></Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserDropdown = ({ username, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".dropdown-container")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="relative inline-block text-left dropdown-container">
      <button
        onClick={toggleDropdown}
        className="text-white font-bold px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out"
      >
        {username}
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            onClick={() => navigate("/profile")}
            className="block w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 transition duration-150 ease-in-out rounded-t-lg"
          >
            Profile
          </button>
          <button
            onClick={() => navigate("/favorites")}
            className="block w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 transition duration-150 ease-in-out"
          >
            Favorites
          </button>
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 transition duration-150 ease-in-out rounded-b-lg"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;

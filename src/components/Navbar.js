import React from "react";
import { Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";

const Navbar = ({ username, avatar, onLogout, notifications }) => {
  return (
    <nav className="bg-customPurple p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Title */}
        <Link
          to="/"
          className="text-white font-bold text-xl hover:text-gray-200"
        >
          Library System
        </Link>

        {/* Right Side of Navbar */}
        <div className="flex items-center space-x-4">
          {/* Show Borrowed Books Link when user is logged in */}
          {username && (
            <Link
              to="/borrowed-books"
              className="text-white font-bold hover:text-gray-200"
            >
              Borrowed Books
            </Link>
          )}

          {/* User Avatar and Dropdown */}
          {username ? (
            <div className="flex items-center space-x-2">
              {/* Display avatar if it exists */}
              {avatar && (
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              {/* User Dropdown with notifications */}
              <UserDropdown
                username={username}
                onLogout={onLogout}
                notifications={notifications}
              />
            </div>
          ) : (
            <>
              {/* If no user is logged in, show Register and Login buttons */}
              <Link
                to="/register"
                className="text-white  font-bold hover:text-gray-200"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="text-white  font-bold hover:text-gray-200"
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

import React from "react";
import { Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";

const Navbar = ({ username, onLogout }) => {
  return (
    <nav className="bg-indigo-600 p-4 shadow-lg w-full">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">
          Library System
        </Link>
        <div>
          {username ? (
            <UserDropdown username={username} onLogout={onLogout} />
          ) : (
            <>
              <Link to="/register" className="text-white px-4">
                Register
              </Link>
              <Link to="/login" className="text-white px-4">
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

import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">
          Library System
        </Link>
        <div>
          {/* 添加链接到注册和登录页面 */}
          <Link to="/register" className="text-white px-4">
            Register
          </Link>
          <Link to="/login" className="text-white px-4">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

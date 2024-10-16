import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserLogin = ({ setUsername }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const API_BASE_URL = "http://localhost:5000/api";
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      setUsername(data.username);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="container mx-auto -mt-20 flex flex-col items-center justify-center min-h-screen">
      <img src="/lock2.svg" alt="Lock Icon" className="mb-4 w-40 h-40" />

      <h2 className="text-3xl font-bold text-customPurple mb-6">
        Library Authenticate
      </h2>
      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-md w-full">
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Login Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-customPurple text-white py-2 px-4 w-full rounded hover:bg-customLightPurple"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserLogin;

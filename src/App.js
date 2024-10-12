import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserRegister from "./components/UserRegister";
import UserLogin from "./components/UserLogin";
import BookList from "./components/BookList";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");
    if (token && savedUsername) {
      setUsername(savedUsername); // 设定用户名
    }
  }, []);

  return (
    <Router>
      <AppContent username={username} setUsername={setUsername} />
    </Router>
  );
};

const AppContent = ({ username, setUsername }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(""); // 清空用户名
    navigate("/login"); // 使用 useNavigate 进行页面跳转
  };

  return (
    <>
      <Navbar username={username} onLogout={handleLogout} />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route
            path="/register"
            element={<UserRegister setUsername={setUsername} />}
          />
          <Route
            path="/login"
            element={<UserLogin setUsername={setUsername} />}
          />
          <Route path="/books" element={<BookList />} />
        </Routes>
      </div>
    </>
  );
};

export default App;

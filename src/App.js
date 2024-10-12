import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserRegister from "./components/UserRegister";
import UserLogin from "./components/UserLogin";
import BookList from "./components/BookList";
import Profile from "./components/Profile";
import BorrowedBooks from "./components/BorrowedBooks";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");
    if (token && savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  return (
    <Router>
      <AppContent username={username} setUsername={setUsername} />
      <ToastContainer />
    </Router>
  );
};

const AppContent = ({ username, setUsername }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername("");
    toast.success("Logout successful!");
    navigate("/login");
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/borrowed-books" element={<BorrowedBooks />} />
        </Routes>
      </div>
    </>
  );
};

export default App;

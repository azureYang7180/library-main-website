import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserRegister from "./components/UserRegister";
import UserLogin from "./components/UserLogin";
import BookList from "./components/BookList";
import Profile from "./components/Profile";
import BorrowedBooks from "./components/BorrowedBooks";
import Favorites from "./components/Favorites";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [username, setUsername] = useState("");
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");

    if (token && savedUsername) {
      setUsername(savedUsername);

      // Fetch notification count
      const fetchNotifications = async () => {
        try {
          const { data } = await axios.get(
            "http://localhost:5000/api/users/notifications",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setNotifications(data.notifications);
        } catch (error) {
          console.error("Error fetching notifications", error);
        }
      };

      fetchNotifications();
    }
  }, []);

  return (
    <Router>
      <AppContent
        username={username}
        setUsername={setUsername}
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <ToastContainer />
    </Router>
  );
};

const AppContent = ({
  username,
  setUsername,
  notifications,
  setNotifications,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername("");
    setNotifications(0); // Reset notifications on logout
    toast.success("Logout successful!");
    navigate("/login");
  };

  const resetNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/users/reset-notifications",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(0); // Reset notification count in state
    } catch (error) {
      console.error("Error resetting notifications", error);
    }
  };

  return (
    <>
      <Navbar
        username={username}
        onLogout={handleLogout}
        notifications={notifications}
        onResetNotifications={resetNotifications} // Pass resetNotifications to Navbar
      />
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
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </>
  );
};

export default App;

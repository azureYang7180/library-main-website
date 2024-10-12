// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserRegister from "./components/UserRegister";
import UserLogin from "./components/UserLogin";
import BookList from "./components/BookList";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/register" element={<UserRegister />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/books" element={<BookList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import moment from "moment"; // 用于日期格式化

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/users/borrowed-books",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBorrowedBooks(data);
      } catch (error) {
        toast.error("Error fetching borrowed books");
      }
    };

    fetchBorrowedBooks();
  }, []);

  const handleReturn = async (bookId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/books/return/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Return successful");
      setBorrowedBooks((prevBooks) =>
        prevBooks.filter((book) => book._id !== bookId)
      );
    } catch (error) {
      toast.error("Error returning the book");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Borrowed Books</h1>
      {borrowedBooks.length === 0 ? (
        <p className="text-center">You haven't borrowed any books.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {borrowedBooks.map((book) => (
            <div key={book._id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-xl font-bold">{book.title}</h3>
              <p className="mt-2">Author: {book.author}</p>
              <p className="mt-2">
                Borrowed Date: {moment(book.borrowDate).format("MMMM Do YYYY")}
              </p>{" "}
              {/* 借书日期格式化 */}
              <button
                onClick={() => handleReturn(book._id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
              >
                Return
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 返回主页按钮 */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default BorrowedBooks;

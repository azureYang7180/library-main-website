import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BookItem = ({ book }) => {
  const [copiesAvailable, setCopiesAvailable] = useState(book.copiesAvailable);

  const handleBorrow = async () => {
    try {
      const token = localStorage.getItem("token"); // 获取存储在 localStorage 中的用户 token
      const response = await axios.post(
        `http://localhost:5000/api/books/borrow/${book._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 成功借书后，更新剩余数量
      setCopiesAvailable(copiesAvailable - 1);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800">{book.title}</h3>
        <p className="text-gray-600 mt-2">Author: {book.author}</p>
        <p className="text-gray-600 mt-2">Category: {book.category}</p>
        <p className="text-gray-600 mt-2">
          Copies Available: {copiesAvailable}
        </p>
      </div>
      <div className="p-4 bg-gray-50">
        <button
          onClick={handleBorrow}
          disabled={copiesAvailable === 0}
          className={`${
            copiesAvailable === 0
              ? "bg-gray-400"
              : "bg-indigo-600 hover:bg-indigo-500"
          } text-white px-4 py-2 rounded transition-colors duration-200`}
        >
          {copiesAvailable > 0 ? "Borrow" : "No copies available"}
        </button>
      </div>
    </div>
  );
};

export default BookItem;

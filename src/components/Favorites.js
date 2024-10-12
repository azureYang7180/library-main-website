import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:5000/api/favorites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFavorites(data);
      } catch (error) {
        toast.error("Error fetching favorites");
      }
    };

    fetchFavorites();
  }, []);

  const handleBorrow = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/books/borrow/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setFavorites((prevFavorites) =>
        prevFavorites.map((book) =>
          book._id === bookId ? { ...book, isBorrowed: true } : book
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleRemoveFavorite = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/favorites/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(favorites.filter((book) => book._id !== bookId));
      toast.success("Book removed from favorites");
    } catch (error) {
      toast.error("Error removing from favorites");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6">My Favorite Books</h1>
      {favorites.length === 0 ? (
        <p className="text-center">You haven't favorited any books.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((book) => (
            <div key={book._id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-xl font-bold">{book.title}</h3>
              <p className="mt-2">Author: {book.author}</p>
              <p className="mt-2">Category: {book.category}</p> {/* 添加类别 */}
              <div className="flex justify-start mt-4 space-x-4">
                {" "}
                {/* 按钮左对齐 */}
                <button
                  onClick={() => handleBorrow(book._id)}
                  disabled={book.isBorrowed}
                  className={`${
                    book.isBorrowed
                      ? "bg-gray-400"
                      : "bg-indigo-600 hover:bg-indigo-500"
                  } text-white px-4 py-2 rounded transition-colors duration-200`}
                >
                  {book.isBorrowed ? "Borrowed" : "Borrow"}
                </button>
                <button
                  onClick={() => handleRemoveFavorite(book._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
                >
                  Remove
                </button>
              </div>
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

export default Favorites;

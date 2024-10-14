import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [notifiedBooks, setNotifiedBooks] = useState([]); // 跟踪已通知的书籍
  const notifiedBooksRef = useRef(notifiedBooks); // 使用 useRef 来追踪 notifiedBooks
  const navigate = useNavigate();
  const [hasFetched, setHasFetched] = useState(false); // 防止重复获取数据

  // Function to reset the notification count
  const onResetNotifications = async () => {
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
    } catch (error) {
      console.error("Error resetting notifications", error);
    }
  };

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

        // 检查书籍是否有库存，并且是否需要通知用户
        let newNotifiedBooks = [...notifiedBooksRef.current]; // 使用 ref 保存的 notifiedBooks
        data.forEach((book) => {
          if (
            book.copiesAvailable > 0 &&
            !newNotifiedBooks.includes(book._id)
          ) {
            toast.info(`${book.title} is now available for borrowing.`);
            newNotifiedBooks.push(book._id); // 添加到通知书籍中
          }
        });

        // 更新通知过的书籍ID
        if (newNotifiedBooks.length !== notifiedBooksRef.current.length) {
          setNotifiedBooks(newNotifiedBooks);
          notifiedBooksRef.current = newNotifiedBooks; // 同步 ref 值
        }

        // 重置通知
        await onResetNotifications();
      } catch (error) {
        toast.error("Error fetching favorites");
      }
    };

    // 仅在第一次加载时获取数据
    if (!hasFetched) {
      fetchFavorites();
      setHasFetched(true); // 标记数据已加载，避免重复获取
    }
  }, [hasFetched]); // 依赖项仅为 hasFetched

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
              <p className="mt-2">Category: {book.category}</p>
              <div className="flex justify-start mt-4 space-x-4">
                <button
                  onClick={() => handleBorrow(book._id)}
                  disabled={book.isBorrowed}
                  className={`${
                    book.isBorrowed
                      ? "bg-gray-400"
                      : "bg-customPurple hover:bg-customLightPurple"
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

      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/")}
          className="bg-customPurple text-white py-2 px-4 rounded hover:bg-customLightPurple "
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Favorites;

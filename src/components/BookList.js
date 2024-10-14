import React, { useEffect, useState } from "react";
import { getBooks } from "../services/api";
import BookItem from "./BookItem";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks();
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-10">
        <h1 className="text-3xl text-customPurple font-bold text-center  mb-6">
          Library Books
        </h1>
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
          />
        </div>

        {loading ? (
          <div className="text-center">
            <span className="spinner-border spinner text-blue-500"></span>
            <p className="text-gray-600">Loading books...</p>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookItem key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No books found</p>
        )}
      </div>
    </div>
  );
};

export default BookList;

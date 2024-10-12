// src/components/BookItem.js
import React from "react";

const BookItem = ({ book }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800">{book.title}</h3>
        <p className="text-gray-600 mt-2">Author: {book.author}</p>
        <p className="text-gray-600 mt-2">Category: {book.category}</p>
        <p className="text-gray-600 mt-2">
          Copies Available: {book.copiesAvailable}
        </p>
      </div>
      <div className="p-4 bg-gray-50">
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 transition-colors duration-200">
          Borrow
        </button>
      </div>
    </div>
  );
};

export default BookItem;

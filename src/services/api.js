// src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const registerUser = async (userData) => {
  return await axios.post(`${API_BASE_URL}/users`, userData);
};

export const getBooks = async () => {
  return await axios.get(`${API_BASE_URL}/books`);
};

export const addBook = async (bookData) => {
  return await axios.post(`${API_BASE_URL}/books`, bookData);
};

export const deleteBook = async (bookId) => {
  return await axios.delete(`${API_BASE_URL}/books/${bookId}`);
};

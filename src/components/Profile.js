import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, // For Pie chart
} from "chart.js";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Profile = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartType, setChartType] = useState("bar"); // Default chart type is bar
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    const loadProfileData = async () => {
      const token = localStorage.getItem("token");
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAvatarUrl(data.avatar);

        const borrowHistoryResponse = await axios.get(
          "http://localhost:5000/api/users/all-borrowed-books",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBorrowHistory(borrowHistoryResponse.data);
        setFilteredBooks(borrowHistoryResponse.data);
      } catch (error) {
        console.error("Error loading profile data", error);
      }
    };

    loadProfileData();
  }, []);

  // 处理密码更新
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/users/change-password",
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password updated successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Error updating password");
    }
  };

  // 处理头像上传
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        "http://localhost:5000/api/users/upload-avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAvatarUrl(data.avatar);
      toast.success("Avatar uploaded successfully!");
    } catch (error) {
      toast.error("Error uploading avatar");
    }
  };

  // 生成类别数据
  const getCategoryData = () => {
    const categoryCount = {};

    filteredBooks.forEach((book) => {
      const category = book.category || "Uncategorized";
      if (categoryCount[category]) {
        categoryCount[category]++;
      } else {
        categoryCount[category] = 1;
      }
    });

    const labels = Object.keys(categoryCount);
    const data = Object.values(categoryCount);
    const backgroundColors = [
      "rgba(255, 99, 132, 0.6)",
      "rgba(54, 162, 235, 0.6)",
      "rgba(75, 192, 192, 0.6)",
      "rgba(255, 206, 86, 0.6)",
      "rgba(153, 102, 255, 0.6)",
      "rgba(255, 159, 64, 0.6)",
      "rgba(231, 233, 237, 0.6)",
    ];

    return {
      labels,
      datasets: [
        {
          label: "Books Borrowed by Category",
          data,
          backgroundColor: backgroundColors.slice(0, labels.length),
        },
      ],
    };
  };

  // 日期范围过滤
  const filterByDate = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end date");
      return;
    }

    const filtered = borrowHistory.filter((entry) => {
      const borrowDate = new Date(entry.borrowDate);
      return (
        borrowDate >= new Date(startDate) && borrowDate <= new Date(endDate)
      );
    });

    setFilteredBooks(filtered);
  };

  // 重置筛选
  const resetFilter = () => {
    setFilteredBooks(borrowHistory);
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl text-center font-bold mb-12">Profile</h1>

      {/* 将头像和密码部分保留在左边 */}
      <div className="flex justify-start">
        <div className="w-1/3 flex flex-col items-center">
          {avatarUrl && (
            <img
              src={`http://localhost:5000${avatarUrl}`}
              alt="Avatar"
              className="mb-4 w-32 h-32 rounded-full"
            />
          )}
          <div className="text-lg font-semibold mb-4">{username}</div>
          <div className="mb-4">
            <input
              type="file"
              id="avatarUpload"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <label
              htmlFor="avatarUpload"
              className="bg-customPurple text-white py-2 px-4 rounded hover:bg-customLightPurple cursor-pointer"
            >
              Upload Avatar
            </label>
          </div>
        </div>

        <div className="w-2/3">
          {/* 密码更新部分保留在右边 */}
          <form onSubmit={handlePasswordChange} className="mb-8">
            <div className="mb-4">
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-2 rounded w-3/5"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border p-2 rounded w-3/5"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-customPurple text-white py-2 px-8 w-fit rounded hover:bg-customLightPurple"
              >
                Update Password
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-green-600 text-white py-2 px-8 w-fit rounded hover:bg-green-700"
              >
                Back to Home
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 图表部分独立居中 */}
      <div className="flex justify-center items-center flex-col mt-12">
        <h2 className="text-2xl font-semibold mb-6">
          Books Borrowed by Category
        </h2>
        <div className="flex justify-center items-center mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded mr-4"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded mr-4"
          />
          <button
            onClick={filterByDate}
            className="bg-customPurple text-white py-2 px-4 rounded hover:bg-customLightPurple"
          >
            Filter by Date
          </button>
          <button
            onClick={resetFilter}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400 ml-4"
          >
            Reset
          </button>
        </div>

        <div className="flex justify-center w-full">
          {filteredBooks.length > 0 ? (
            chartType === "bar" ? (
              <Bar
                data={getCategoryData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
                height={600}
                width={900}
              />
            ) : (
              <Pie
                data={getCategoryData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
                height={500}
                width={700}
              />
            )
          ) : (
            <p className="text-center">No borrowed books available.</p>
          )}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => setChartType(chartType === "bar" ? "pie" : "bar")}
            className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-400"
          >
            {chartType === "bar" ? "Switch to Pie" : "Switch to Bar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

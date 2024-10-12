import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(""); // 存储头像URL
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    const loadAvatar = async () => {
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
      } catch (error) {
        console.error("Error loading avatar", error);
      }
    };

    loadAvatar();
  }, []);

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

      setAvatarUrl(data.avatar); // 更新头像URL
      toast.success("Avatar uploaded successfully!");
    } catch (error) {
      toast.error("Error uploading avatar");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl text-center font-bold mb-6">Profile</h1>
      <div className="flex justify-start">
        {/* 左边：头像和用户名 */}
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
              className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 cursor-pointer"
            >
              Upload Avatar
            </label>
          </div>
        </div>

        {/* 右边：修改密码和按钮 */}
        <div className="w-2/3">
          <form onSubmit={handlePasswordChange} className="mb-4">
            <div className="mb-4">
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-2 rounded w-3/5" // 使输入框更短
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border p-2 rounded w-3/5" // 使输入框更短
              />
            </div>
            {/* 按钮容器，确保按钮大小和对齐 */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-8 w-fit rounded hover:bg-indigo-700"
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
    </div>
  );
};

export default Profile;

import { useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

const Settings = () => {
  const { user, setUser } = useUser();
  const [profilePic, setProfilePic] = useState(user.profilePic || "https://placehold.co/100x100");
  const [emailToggle, setEmailToggle] = useState(true); // Optional toggle, not connected to backend yet
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out!");
    window.location.href = "/login";
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_preset_here"); // 🔁 Replace with your Cloudinary preset

    try {
      const cloudRes = await axios.post(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", // 🔁 Replace with your cloud name
        formData
      );

      const imageUrl = cloudRes.data.secure_url;
      setProfilePic(imageUrl);

      await axios.put(
        "/api/users/settings/profile-pic",
        { profilePic: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser((prev) => ({ ...prev, profilePic: imageUrl }));
      alert("Profile picture updated");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile picture");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "/api/users/settings/password",
        {
          currentPassword: password,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password changed successfully");
      setPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to update password");
    }
  };

  return (
    <div className="pt-28 px-6 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">⚙️ Settings</h2>

      {/* Profile Picture */}
      <div className="bg-white/5 p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">🖼️ Profile Picture</h3>
        <div className="flex items-center gap-4">
          <img
            src={profilePic}
            alt="Profile"
            className="w-20 h-20 rounded-full shadow object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="text-sm"
          />
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-white/5 p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">🔐 Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 rounded outline-none"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 rounded outline-none"
            required
          />
          <button
            type="submit"
            className="bg-mutedGreen px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Email Notifications Toggle (Optional) */}
      <div className="bg-white/5 p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">📧 Email Notifications</h3>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={emailToggle}
            onChange={() => setEmailToggle(!emailToggle)}
          />
          <span className="text-sm">Enable email notifications</span>
        </label>
      </div>

      {/* Logout Button */}
      <div className="text-center">
        <button
          onClick={handleLogout}
          className="bg-red-600 px-6 py-2 rounded hover:bg-red-700 transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;

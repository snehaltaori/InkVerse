import { useState } from "react";

const Settings = () => {
  const [profilePic, setProfilePic] = useState("https://placehold.co/100x100");
  const [emailToggle, setEmailToggle] = useState(true);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleLogout = () => {
    // TODO: remove token from storage
    alert("Logged out!");
    window.location.href = "/login";
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    // TODO: upload to Cloudinary in real setup
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // TODO: send to backend
    alert("Password changed!");
    setPassword("");
    setNewPassword("");
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
            className="w-20 h-20 rounded-full shadow"
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

      {/* Email Notifications */}
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

      {/* Logout */}
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

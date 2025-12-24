import { useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

const Settings = () => {
    const { user, setUser } = useUser();
    const token = localStorage.getItem("token");

    const [profilePic, setProfilePic] = useState(
        user?.profilePic || "https://placehold.co/100x100"
    );

    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    if (!user) {
        return (
            <div className="pt-28 text-center text-mutedGreen">
                Please login to access settings.
            </div>
        );
    }

    // 🔹 Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    // 🔹 Profile picture upload
    const handleProfilePicChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append(
                "upload_preset",
                import.meta.env.VITE_CLOUDINARY_PRESET
            );

            const cloudRes = await axios.post(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD
                }/image/upload`,
                formData
            );

            const imageUrl = cloudRes.data.secure_url;
            setProfilePic(imageUrl);

            const res = await axios.put(
                "/api/users/settings/profile-pic",
                { profilePic: imageUrl },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setUser((prev) => ({ ...prev, profilePic: res.data.profilePic }));
            alert("Profile picture updated");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile picture");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Password change
    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            await axios.put(
                "/api/users/settings/password",
                { currentPassword: password, newPassword },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert("Password changed successfully");
            setPassword("");
            setNewPassword("");
        } catch (err) {
            alert(err.response?.data?.error || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-28 px-6 min-h-screen text-white max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">⚙️ Settings</h2>

            {/* Profile Picture */}
            <div className="bg-white/5 p-6 rounded-xl mb-6">
                <h3 className="text-lg font-semibold mb-3">🖼️ Profile Picture</h3>

                <div className="flex items-center gap-4">
                    <img
                        src={profilePic}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        disabled={loading}
                        className="text-sm"
                    />
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white/5 p-6 rounded-xl mb-6">
                <h3 className="text-lg font-semibold mb-3">🔐 Change Password</h3>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <input
                        type="password"
                        placeholder="Current password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 rounded"
                        required
                    />

                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 rounded"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-mutedGreen px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                        Update Password
                    </button>
                </form>
            </div>

            {/* Logout */}
            <div className="text-center">
                <button
                    onClick={handleLogout}
                    className="bg-red-600 px-6 py-2 rounded hover:bg-red-700"
                >
                    🚪 Logout
                </button>
            </div>
        </div>
    );
};

export default Settings;


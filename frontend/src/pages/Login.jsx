import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { useUser } from "../context/UserContext";

const Login = () => {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);

        try {
            const res = await API.post("/auth/login", {
                usernameOrEmail: emailOrUsername.trim(),
                password,
            });

            const { token, user } = res.data;

            // Persist auth
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);

            navigate("/", { replace: true });
        } catch (err) {
            const message =
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Login failed";
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#1a1a1a] pt-24">
            <div className="bg-white/5 p-8 rounded-xl w-full max-w-md shadow-lg backdrop-blur-md">
                <h2 className="text-2xl font-bold text-center mb-6 font-cursive text-mutedGreen">
                    Welcome back to InkVerse
                </h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Email or Username</label>
                        <input
                            type="text"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 text-white rounded outline-none"
                            placeholder="username or email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 text-white rounded outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-mutedGreen rounded hover:bg-green-700 transition disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center mt-4 text-sm text-gray-300">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-blue-400 hover:underline">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

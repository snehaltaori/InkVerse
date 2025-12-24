import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { useUser } from "../context/UserContext";

const Signup = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        // 🔒 Frontend validation
        if (form.username.length < 3) {
            alert("Username must be at least 3 characters");
            return;
        }

        if (form.password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setLoading(true);

        try {
            const res = await API.post("/auth/register", {
                username: form.username.trim(),
                email: form.email.trim(),
                password: form.password,
            });

            // Persist auth
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            setUser(res.data.user);

            navigate("/");
        } catch (err) {
            alert(err.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#1a1a1a] pt-24">
            <div className="bg-white/5 p-8 rounded-xl w-full max-w-md shadow-lg backdrop-blur-md">
                <h2 className="text-2xl font-bold text-center mb-6 font-cursive text-mutedGreen">
                    Join InkVerse
                </h2>

                <form onSubmit={handleSignup} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white/10 text-white rounded outline-none"
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white/10 text-white rounded outline-none"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white/10 text-white rounded outline-none"
                        required
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white/10 text-white rounded outline-none"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-mutedGreen rounded hover:bg-green-700 transition disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-center mt-4 text-sm text-gray-300">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-400 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;


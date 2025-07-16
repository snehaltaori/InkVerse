import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { useUser } from "../context/UserContext";


const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/auth/login", {
      usernameOrEmail: emailOrUsername,
      password,
    });

    // Store token and user in localStorage
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user); 

    navigate("/"); // Redirect after login
  } catch (err) {
    alert(err.response?.data?.error || "Login failed");
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#1a1a1a] pt-24">
      <div className="bg-white/5 p-8 rounded-xl w-full max-w-md shadow-lg backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center mb-6 font-cursive text-mutedGreen">Welcome back to InkVerse</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email or Username</label>
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 text-white rounded outline-none"
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
            className="w-full py-2 bg-mutedGreen rounded hover:bg-green-700 transition"
          >
            Login
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
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Send login request
    console.log("Logging in:", emailOrUsername);
    navigate("/"); // Redirect to home after login (mocked)
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
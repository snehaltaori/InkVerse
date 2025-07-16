import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useUser } from "../context/UserContext";


const Navbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, setUser } = useUser();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleLogout = () => {
  setUser(null);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md shadow text-white px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-cursive text-mutedGreen">InkVerse</Link>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full w-1/2">
        <FaSearch size={14} className="text-mutedGreen" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, tag..."
          className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-400"
        />
      </form>

      {/* Right Side */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        {!user ? (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Signup</Link>
          </>
        ) : (
          <>
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <img src={user?.profilePic || "/assets/Default_profilepic"} alt="profile" className="w-8 h-8 rounded-full" />
              <span className="text-sm">{user.username}</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-12 bg-white/10 backdrop-blur-lg rounded-md p-2 shadow-lg text-sm w-48 z-50 animate-fade-in">
                <Link to="/profile" className="block px-3 py-1 hover:bg-white/10">Profile</Link>
                <Link to="/emails" className="block px-3 py-1 hover:bg-white/10">Emails</Link>
                <Link to="/forums" className="block px-3 py-1 hover:bg-white/10">Forums</Link>
                <Link to="/settings" className="block px-3 py-1 hover:bg-white/10">Settings</Link>
                <Link to="/help" className="block px-3 py-1 hover:bg-white/10">Help</Link>
                <hr className="my-1 border-white/20" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1 hover:bg-white/10 w-full text-left text-red-300"
                >
                  <FiLogOut size={14} /> Logout
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

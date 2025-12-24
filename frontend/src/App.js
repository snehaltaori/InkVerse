import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "./context/UserContext";

import Navbar from "./components/Navbar";
import Homep from "./pages/Homep";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NovelDetails from "./pages/NovelDetails";
import Profile from "./pages/Profile";
import Emails from "./pages/Emails";
import Forums from "./pages/Forums";
import Settings from "./pages/Settings";
import TagNovels from "./pages/TagNovels";
import SearchResults from "./pages/SearchResults";
import ReadPage from "./pages/ReadPage";
import UserProfile from "./pages/UserProfile";

const App = () => {
    const { user, setUser } = useUser();

    // Fetch user from token on app load
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:5000/api/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setUser(data.user);
                    } else {
                        setUser(null);
                    }
                })
                .catch(() => setUser(null));
        }
    }, [setUser]);

    // Wrapper to protect routes
    const PrivateRoute = ({ element }) => {
        return user ? element : <Navigate to="/login" />;
    };

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Homep />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/tags/:tagName" element={<TagNovels />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/read/:chapterId" element={<ReadPage />} />
                <Route path="/novel/:id" element={<NovelDetails />} />


                <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
                <Route path="/emails" element={<PrivateRoute element={<Emails />} />} />
                <Route path="/forums" element={<PrivateRoute element={<Forums />} />} />
                <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />
            </Routes>
        </>
    );
};

export default App;


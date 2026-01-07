import { Routes, Route, Navigate } from "react-router-dom";
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
import Studio from "./pages/Studio";

const PrivateRoute = ({ children }) => {
    const { user } = useUser();
    return user ? children : <Navigate to="/login" />;
};

export default function App() {
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

                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/profile/:userId" element={<PrivateRoute><Profile /></PrivateRoute>} />

                <Route path="/studio" element={<PrivateRoute><Studio /></PrivateRoute>} />
                <Route path="/emails" element={<PrivateRoute><Emails /></PrivateRoute>} />
                <Route path="/forums" element={<PrivateRoute><Forums /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            </Routes>
        </>
    );
}


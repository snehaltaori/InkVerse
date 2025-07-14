import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
// Add more imports as needed, like ChapterReader, TagSearch, etc.

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homep />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dynamic Novel Details */}
        <Route path="/novel/:id" element={<NovelDetails />} />
        <Route path="/tags/:tagName" element={<TagNovels />} />
        
        <Route path="/search" element={<SearchResults />} />
        
<Route path="/read/:id/:chapterId" element={<ReadPage />} />
        {/* Authenticated Pages */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/emails" element={<Emails />} />
        <Route path="/forums" element={<Forums />} />
        <Route path="/settings" element={<Settings />} />

        {/* Optional Future Routes */}
        {/* <Route path="/read/:novelId/:chapterId" element={<ChapterReader />} /> */}
        {/* <Route path="/tag/:tagName" element={<TagSearch />} /> */}
      </Routes>
    </>
  );
}

export default App;


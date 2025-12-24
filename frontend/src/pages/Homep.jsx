import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../utils/api";

const genres = [
    "Romance", "Fantasy", "Mystery", "Drama", "Horror",
    "Sci-Fi", "Thriller", "Historical", "Poetry", "Adventure"
];

const Homep = () => {
    const [novels, setNovels] = useState([]);
    const [popular, setPopular] = useState([]);
    const [newBooks, setNewBooks] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const LIMIT = 15; // MUST match backend

    /* ---------------- Fetch novels ---------------- */
    useEffect(() => {
        const fetchNovels = async () => {
            setLoading(true);
            try {
                const res = await API.get(`/novels?page=${currentPage}`);
                setNovels(res.data.novels || []);
                setTotalPages(Math.ceil((res.data.total || 0) / LIMIT));
            } catch (err) {
                console.error("Failed to load novels", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNovels();
    }, [currentPage]);

    /* ---------------- Sidebar data ---------------- */
    useEffect(() => {
        const fetchSidebar = async () => {
            try {
                const [popularRes, newRes] = await Promise.all([
                    API.get("/novels/popular"),
                    API.get("/novels/new"),
                ]);

                setPopular(popularRes.data || []);
                setNewBooks(newRes.data || []);
            } catch (err) {
                console.error("Failed to load sidebar data", err);
            }
        };

        fetchSidebar();
    }, []);

    const handlePageClick = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="pt-24 px-6 text-white">
            {/* Genres */}
            <div className="flex flex-wrap gap-4 justify-center mb-6">
                {genres.map((tag) => (
                    <Link
                        key={tag}
                        to={`/tags/${tag.toLowerCase()}`}
                        className="bg-mutedGreen px-4 py-1 rounded-full hover:bg-opacity-80"
                    >
                        {tag}
                    </Link>
                ))}
            </div>

            {/* Slider */}
            <motion.div
                className="h-[20vh] bg-cover bg-center mb-8 rounded-lg shadow-md"
                style={{ backgroundImage: `url('/dark-academia-slider.jpg')` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="h-full w-full bg-black/40 flex items-center justify-center rounded-lg">
                    <h2 className="text-3xl font-cursive">“Ink bleeds beauty”</h2>
                </div>
            </motion.div>

            {/* Novels Grid */}
            {loading ? (
                <p className="text-center text-gray-400">Loading novels...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {novels.map((novel) => (
                        <Link
                            key={novel._id}
                            to={`/novel/${novel._id}`}
                            className="flex bg-white/5 p-4 rounded-lg hover:bg-white/10"
                        >
                            <img
                                src={novel.coverImage || "/placeholder.jpg"}
                                alt={novel.title}
                                className="w-24 mr-4 rounded"
                            />

                            <div>
                                <h3 className="text-lg font-bold">{novel.title}</h3>

                                <p className="text-sm text-mutedGreen mb-1">
                                    {novel.author?.username || "Unknown Author"}
                                </p>

                                <p className="text-sm line-clamp-3">
                                    {novel.description}
                                </p>

                                <span className="text-sm text-blue-400 mt-1 inline-block">
                                    See more
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-3 mb-12">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => handlePageClick(num)}
                            className={`px-3 py-1 rounded ${currentPage === num
                                    ? "bg-mutedGreen"
                                    : "bg-white/10 hover:bg-white/20"
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            )}

            {/* Popular & New */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="text-xl font-semibold mb-3">🔥 Popular Searches</h4>
                    {popular.map((book) => (
                        <Link
                            key={book._id}
                            to={`/novel/${book._id}`}
                            className="block text-sm text-blue-300 hover:underline mb-1"
                        >
                            {book.title}
                        </Link>
                    ))}
                </div>

                <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="text-xl font-semibold mb-3">🆕 Newly Added</h4>
                    {newBooks.map((book) => (
                        <Link
                            key={book._id}
                            to={`/novel/${book._id}`}
                            className="block text-sm text-blue-300 hover:underline mb-1"
                        >
                            {book.title}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center py-6 font-cursive text-mutedGreen italic">
                “A room without books is like a body without a soul.”
            </footer>
        </div>
    );
};

export default Homep;

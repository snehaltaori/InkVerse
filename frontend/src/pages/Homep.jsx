import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../utils/api";
import BookCover from "../components/BookCover";
import NovelRowSkeleton from "../components/skeletons/NovelRowSkeleton";
import SidebarListSkeleton from "../components/skeletons/SidebarListSkeleton";


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

    const LIMIT = 15;

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <NovelRowSkeleton key={i} />
                    ))
                    : novels.map((novel) => (
                        <Link
                            key={novel._id}
                            to={`/novel/${novel._id}`}
                            className="
                              flex gap-4 bg-white/5 p-4 rounded-lg
                              transition-all duration-200 ease-out
                              hover:bg-white/10
                              hover:-translate-y-[2px]
                              hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]
                            "

                        >
                            <BookCover
                                title={novel.title}
                                coverTitle={novel.coverTitle}
                                coverImage={novel.coverImage}
                                size="md"
                            />

                            <div>
                                <h3 className="text-lg font-serif font-semibold">
                                    {novel.title}
                                </h3>

                                <p className="text-sm text-mutedGreen mb-1">
                                    {novel.author?.username || "Unknown Author"}
                                </p>

                                <p className="text-sm line-clamp-3 opacity-80">
                                    {novel.description}
                                </p>

                                <span className="text-sm text-green-400 mt-1 inline-block">
                                    See more
                                </span>
                            </div>
                        </Link>
                    ))}
            </div>


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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

                {/* Popular */}
                <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="text-xl font-semibold mb-4">
                        Popular Searches
                    </h4>

                    {popular.length === 0 ? (
                        <SidebarListSkeleton />
                    ) : (
                        <ul className="space-y-2">
                            {popular.map((book) => (
                                <li key={book._id}>
                                    <Link
                                        to={`/novel/${book._id}`}
                                        className="text-mutedGreen hover:text-green-400 hover:underline transition font-medium"
                                    >
                                        {book.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                </div>


                {/* New */}
                <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="text-xl font-semibold mb-4">
                        Newly Added
                    </h4>

                    {popular.length === 0 ? (
                        <SidebarListSkeleton />
                    ) : (
                        <ul className="space-y-2">
                            {popular.map((book) => (
                                <li key={book._id}>
                                    <Link
                                        to={`/novel/${book._id}`}
                                        className="text-mutedGreen hover:text-green-400 hover:underline transition font-medium"
                                    >
                                        {book.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

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


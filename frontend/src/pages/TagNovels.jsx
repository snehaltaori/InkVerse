import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BookCover from "../components/BookCover";

const TagNovels = () => {
    const { tagName } = useParams();

    const [novels, setNovels] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const novelsPerPage = 15;

    useEffect(() => {
        const fetchNovels = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `/api/novels/tags/${tagName}?page=${currentPage}`
                );

                setNovels(res.data.novels || []);
                setTotalPages(
                    Math.ceil((res.data.total || 0) / novelsPerPage)
                );
            } catch (err) {
                console.error("Failed to fetch novels by tag", err);
                setNovels([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        fetchNovels();
        window.scrollTo(0, 0);
    }, [tagName, currentPage]);

    return (
        <div className="pt-24 px-6 min-h-screen text-white">
            <h2 className="text-2xl font-bold mb-6">
                Results for tag:{" "}
                <span className="text-mutedGreen capitalize">{tagName}</span>
            </h2>

            {loading && (
                <p className="text-mutedGreen mb-6">Loading novels...</p>
            )}

            {!loading && novels.length === 0 && (
                <p className="text-mutedGreen mb-6">
                    No novels found for this tag.
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {novels.map((novel) => (
                    <Link
                        key={novel._id}
                        to={`/novel/${novel._id}`}
                        className="flex bg-white/5 p-4 rounded-lg hover:bg-white/10 transition"
                    >
                        {/* ✅ CORRECT COVER SYSTEM */}
                        <BookCover
                            title={novel.coverTitle || novel.title}
                            image={novel.coverImage}
                            size="small"
                        />

                        <div className="flex flex-col ml-4">
                            <h3 className="text-lg font-bold">
                                {novel.title}
                            </h3>

                            <p className="text-mutedGreen text-sm mb-1">
                                by {novel.author?.username || "Unknown"}
                            </p>

                            <p className="text-sm line-clamp-3">
                                {novel.description}
                            </p>

                            {novel.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {novel.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs bg-white/10 px-2 py-0.5 rounded"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <span className="text-sm text-blue-400 mt-auto">
                                See more →
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-3 mb-12">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 rounded ${currentPage === page
                                        ? "bg-mutedGreen text-white"
                                        : "bg-white/10 hover:bg-white/20"
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default TagNovels;


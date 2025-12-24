import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../utils/api";

const SearchResults = () => {
    const location = useLocation();
    const query =
        new URLSearchParams(location.search).get("q")?.toLowerCase() || "";

    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) return;

        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const res = await API.get(
                    `/novels/search?q=${query}&page=${page}`
                );

                const novels = Array.isArray(res.data.novels)
                    ? res.data.novels
                    : [];

                setResults(novels);

                // if fewer than 15 → no more pages
                setHasMore(novels.length === 15);
            } catch (err) {
                console.error("Search error:", err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query, page]);

    return (
        <div className="pt-24 px-6 text-white min-h-screen">
            <h2 className="text-2xl mb-6">
                Search Results for{" "}
                <span className="italic text-mutedGreen">"{query}"</span>
            </h2>

            {loading && <p className="text-mutedGreen">Searching...</p>}

            {!loading && results.length === 0 && (
                <p className="text-mutedGreen">No novels found.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {results.map((novel) => (
                    <Link
                        key={novel._id}
                        to={`/novel/${novel._id}`}
                        className="flex bg-white/5 p-4 rounded-lg hover:bg-white/10 transition"
                    >
                        <img
                            src={novel.cover}
                            alt={novel.title}
                            className="w-24 h-32 object-cover mr-4 rounded"
                        />

                        <div className="flex flex-col">
                            <h3 className="text-lg font-bold">{novel.title}</h3>

                            <p className="text-sm text-mutedGreen mb-1">
                                by {novel.author}
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
            {results.length > 0 && (
                <div className="flex justify-center gap-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-1 rounded bg-white/10 disabled:opacity-40"
                    >
                        ◀ Prev
                    </button>

                    <span className="text-mutedGreen">Page {page}</span>

                    <button
                        disabled={!hasMore}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-1 rounded bg-white/10 disabled:opacity-40"
                    >
                        Next ▶
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchResults;


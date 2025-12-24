import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../utils/api";
import { useUser } from "../context/UserContext";

const NovelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, addToLibrary } = useUser();

    const [novel, setNovel] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);

    // Add to library
    const handleAddToLibrary = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            await API.post(`/users/library/${id}`);
            addToLibrary(novel);
            alert("Added to your library!");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add to library");
        }
    };

    // Read Now
    const handleReadNow = async () => {
        try {
            const res = await API.get(`/chapters/${id}/first`);
            navigate(`/read/${res.data._id}`);
        } catch {
            alert("No chapters available yet");
        }
    };

    // Fetch novel + chapters
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [novelRes, chaptersRes] = await Promise.all([
                    API.get(`/novels/${id}`),
                    API.get(`/chapters/novel/${id}`),
                ]);

                setNovel(novelRes.data);
                setChapters(Array.isArray(chaptersRes.data) ? chaptersRes.data : []);
            } catch {
                setNovel(null);
                setChapters([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="pt-24 text-center text-mutedGreen">
                Loading novel...
            </div>
        );
    }

    if (!novel) {
        return (
            <div className="pt-24 text-center text-red-400">
                Novel not found.
            </div>
        );
    }

    return (
        <div className="pt-28 px-6 min-h-screen text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-6 bg-white/5 p-6 rounded-xl mb-8">
                <img
                    src={novel.coverImage || "https://placehold.co/120x180"}
                    alt={novel.title}
                    className="w-[120px] rounded shadow"
                />

                <div>
                    <h1 className="text-3xl font-bold">{novel.title}</h1>

                    <p className="text-mutedGreen mb-2">
                        by {novel.author}
                    </p>

                    <p className="mb-4 text-sm">{novel.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {novel.tags?.map((tag, idx) => (
                            <span
                                key={idx}
                                className="bg-mutedGreen/80 px-3 py-1 rounded-full text-sm"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        {chapters.length > 0 && (
                            <button
                                onClick={handleReadNow}
                                className="bg-mutedGreen px-4 py-2 rounded hover:bg-green-700"
                            >
                                📖 Read Now
                            </button>
                        )}

                        <button
                            onClick={handleAddToLibrary}
                            className="bg-white/10 px-4 py-2 rounded hover:bg-white/20"
                        >
                            ➕ Add to Library
                        </button>
                    </div>
                </div>
            </div>

            {/* Table of Contents */}
            <div className="bg-white/5 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">
                    📚 Table of Contents
                </h2>

                {chapters.length === 0 ? (
                    <p className="text-mutedGreen">
                        No chapters available yet.
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {chapters.map((ch) => (
                            <li
                                key={ch._id}
                                className="border-b border-white/10 pb-2"
                            >
                                <Link
                                    to={`/read/${ch._id}`}
                                    className="hover:underline text-blue-300"
                                >
                                    {ch.chapterNumber}. {ch.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default NovelDetails;
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../utils/api";
import { useUser } from "../context/UserContext";
import BookCover from "../components/BookCover";

import PageShell from "../components/PageShell";
import NovelDetailsSkeleton from "../components/skeletons/NovelDetailsSkeleton";

const NovelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, addToLibrary } = useUser();

    const [novel, setNovel] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);

    const isInLibrary =
        !!user &&
        !!novel &&
        user.library?.some(
            (b) => b === novel._id || b?._id === novel._id
        );

    useEffect(() => {
        if (isInLibrary) setAdded(true);
    }, [isInLibrary]);

    const handleAddToLibrary = async () => {
        if (!user || added || isInLibrary) return;

        try {
            await API.post(`/users/library/${id}`);
            addToLibrary(novel);
            setAdded(true);
        } catch (err) {
            if (err.response?.status !== 400) {
                alert("Failed to add to library");
            }
        }
    };

    const handleReadNow = async () => {
        try {
            const res = await API.get(`/chapters/${id}/first`);
            navigate(`/read/${res.data._id}`);
        } catch {
            alert("No chapters available yet");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [novelRes, chaptersRes] = await Promise.all([
                    API.get(`/novels/${id}`),
                    API.get(`/chapters/novel/${id}`),
                ]);

                setNovel(novelRes.data);
                setChapters(
                    Array.isArray(chaptersRes.data)
                        ? chaptersRes.data
                        : []
                );
            } catch {
                setNovel(null);
                setChapters([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return (
        <PageShell loading={loading} skeleton={<NovelDetailsSkeleton />}>
            {!novel ? (
                <div className="pt-24 text-center text-red-400">
                    Novel not found.
                </div>
            ) : (
                <div className="pt-28 px-6 min-h-screen text-white">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row gap-6 bg-white/5 p-6 rounded-xl mb-8">
                        <BookCover
                            title={novel.title}
                            coverTitle={novel.coverTitle}
                            coverImage={novel.coverImage}
                            size="lg"
                        />

                        <div>
                            <h1 className="text-3xl font-bold">{novel.title}</h1>

                            {added && (
                                <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-mutedGreen/30 text-mutedGreen">
                                    ✔ Added to your library
                                </span>
                            )}

                            {novel.author?._id ? (
                                <p className="text-mutedGreen mb-2">
                                    by{" "}
                                    <Link
                                        to={`/profile/${novel.author._id}`}
                                        className="hover:underline text-blue-300"
                                    >
                                        {novel.author.username}
                                    </Link>
                                </p>
                            ) : (
                                <p className="text-mutedGreen mb-2">
                                    by {novel.author}
                                </p>
                            )}

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
                                        className="bg-mutedGreen px-4 py-2 rounded hover:bg-green-700 transition"
                                    >
                                        📖 Read Now
                                    </button>
                                )}

                                {!added ? (
                                    <button
                                        onClick={handleAddToLibrary}
                                        className="bg-white/10 px-4 py-2 rounded hover:bg-white/20 transition"
                                    >
                                        ➕ Add to Library
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="bg-mutedGreen/30 text-mutedGreen px-4 py-2 rounded cursor-default font-medium"
                                    >
                                        ✔ Added to Library
                                    </button>
                                )}
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
            )}
        </PageShell>
    );
};

export default NovelDetails;


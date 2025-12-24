import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../utils/api";

const ReadPage = () => {
    const { chapterId } = useParams();
    const navigate = useNavigate();

    const [chapter, setChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchChapter = async () => {
            setLoading(true);
            setError("");

            try {
                const res = await API.get(`/chapters/read/${chapterId}`);
                setChapter(res.data);
            } catch (err) {
                setChapter(null);
                setError(err.response?.data?.error || "Chapter not found");
            } finally {
                setLoading(false);
                window.scrollTo(0, 0);
            }
        };

        fetchChapter();
    }, [chapterId]);

    if (loading) {
        return (
            <div className="pt-24 text-center text-mutedGreen">
                Loading chapter...
            </div>
        );
    }

    if (!chapter) {
        return (
            <div className="pt-24 text-center text-red-400">
                {error}
            </div>
        );
    }

    return (
        <div className="pt-24 px-6 pb-16 text-white max-w-3xl mx-auto">
            {/* Back to novel */}
            <Link
                to={`/novel/${chapter.novel}`}
                className="text-blue-300 hover:underline text-lg font-semibold block mb-6"
            >
                ← Back to Novel
            </Link>

            {/* Chapter title */}
            <h2 className="text-3xl font-semibold mb-8 text-center">
                {chapter.title}
            </h2>

            {/* Chapter content */}
            <div className="whitespace-pre-line bg-white/5 p-6 rounded-lg leading-relaxed">
                {chapter.content}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-10">
                <button
                    disabled={!chapter.hasPrev}
                    onClick={() =>
                        chapter.prevChapterId &&
                        navigate(`/read/${chapter.prevChapterId}`)
                    }
                    className={`px-4 py-2 rounded transition ${chapter.hasPrev
                        ? "bg-mutedGreen hover:bg-green-700"
                        : "bg-gray-600 cursor-not-allowed"
                        }`}
                >
                    ← Previous
                </button>

                <button
                    disabled={!chapter.hasNext}
                    onClick={() =>
                        chapter.nextChapterId &&
                        navigate(`/read/${chapter.nextChapterId}`)
                    }
                    className={`px-4 py-2 rounded transition ${chapter.hasNext
                        ? "bg-mutedGreen hover:bg-green-700"
                        : "bg-gray-600 cursor-not-allowed"
                        }`}
                >
                    Next →
                </button>
            </div>
        </div>
    );
};

export default ReadPage;

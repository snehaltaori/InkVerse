import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const ReadPage = () => {
  const { id, chapterId } = useParams(); // novel ID and current chapter ID
  const navigate = useNavigate();

  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/novels/${id}/chapters/${chapterId}`);
        if (!res.ok) {
          throw new Error("Chapter not found");
        }
        const data = await res.json();
        setChapter(data);
      } catch (err) {
        console.error("Failed to fetch chapter:", err);
        setChapter(null);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0); // scroll to top on chapter change
      }
    };

    fetchChapter();
  }, [id, chapterId]);

  if (loading) {
    return <div className="pt-24 px-6 text-white">Loading chapter...</div>;
  }

  if (!chapter) {
    return <div className="pt-24 px-6 text-white">Chapter not found.</div>;
  }

  return (
    <div className="pt-24 px-6 pb-16 text-white max-w-3xl mx-auto leading-relaxed">
      {/* Book Title Link */}
      <Link to={`/novel/${id}`} className="text-blue-300 hover:underline text-xl font-bold block mb-2">
        {chapter.novelTitle}
      </Link>

      {/* Chapter Title */}
      <h2 className="text-2xl md:text-3xl font-semibold mb-2">{chapter.title}</h2>
      <p className="text-mutedGreen mb-6 italic">By {chapter.novelTitle} • Chapter {chapter.title}</p>


      {/* Chapter Content */}
      <div className="whitespace-pre-line text-lg bg-white/5 p-6 rounded-lg shadow">
        {chapter.content}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          disabled={!chapter.hasPrev}
          onClick={() => navigate(`/read/${id}/${chapter.prevChapterId}`)}
          className={`px-4 py-2 rounded ${
            !chapter.hasPrev ? "bg-gray-600 cursor-not-allowed" : "bg-mutedGreen hover:bg-opacity-80"
          }`}
        >
          ← Previous
        </button>

        <button
          disabled={!chapter.hasNext}
          onClick={() => navigate(`/read/${id}/${chapter.nextChapterId}`)}
          className={`px-4 py-2 rounded ${
            !chapter.hasNext ? "bg-gray-600 cursor-not-allowed" : "bg-mutedGreen hover:bg-opacity-80"
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default ReadPage;

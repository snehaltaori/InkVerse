import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

const NovelDetails = () => {
  const { id } = useParams(); // novel ID from route
  const navigate = useNavigate();
  const { user } = useUser();

  const [novel, setNovel] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAddToLibrary = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/users/library/add/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to add to library");
        return;
      }

      alert("Added to your library!");
    } catch (err) {
      console.error("Add to library failed", err);
    }
  };

  useEffect(() => {
    const fetchNovel = async () => {
      try {
        const res = await fetch(`/api/novels/${id}`);
        if (!res.ok) throw new Error("Not found");

        const data = await res.json();
        setNovel(data);
      } catch (err) {
        setNovel(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNovel();
  }, [id]);

  if (loading) return <div className="text-center pt-24 text-white">Loading...</div>;
  if (!novel) return <div className="text-center pt-24 text-red-400">Novel not found.</div>;

  return (
    <div className="pt-28 px-6 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 bg-white/5 p-6 rounded-xl shadow-lg mb-8">
        <img
          src={novel.coverImage || "https://placehold.co/120x180"}
          alt={novel.title}
          className="w-[120px] h-auto rounded shadow"
        />
        <div>
          <h1 className="text-3xl font-bold">{novel.title}</h1>
          <p className="text-mutedGreen mb-2">by {novel.author}</p>
          <p className="mb-4 text-sm">{novel.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {novel.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-mutedGreen/80 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            {novel.chapters.length > 0 && (
              <Link to={`/read/${novel._id}/${novel.chapters[0]._id}`}>
                <button className="bg-mutedGreen hover:bg-green-700 px-4 py-2 rounded transition">
                  📖 Read Now
                </button>
              </Link>
            )}
            <button
              onClick={handleAddToLibrary}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition"
            >
              ➕ Add to Library
            </button>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-white/5 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">📚 Table of Contents</h2>
        {novel.chapters.length === 0 ? (
          <p>No chapters available yet.</p>
        ) : (
          <ul className="space-y-2">
            {novel.chapters.map((chapter, idx) => (
              <li key={chapter._id} className="border-b border-white/10 pb-2">
                <Link
                  to={`/read/${novel._id}/${chapter._id}`}
                  className="block text-left w-full hover:underline text-blue-300"
                >
                  {idx + 1}. {chapter.title}
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

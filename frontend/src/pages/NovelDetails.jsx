import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { useUser } from "../context/UserContext";

// Mock Data
const mockNovel = {
  id: 1,
  title: "The Shadows of Ink",
  author: "Elena Ravens",
  cover: "https://placehold.co/120x180",
  description:
    "A thrilling journey through candlelit libraries, secret societies, and the handwritten sins of ancient ink. For lovers of lore and longing.",
  tags: ["Mystery", "Historical", "Drama"],
  toc: [
    "Prologue: The Whispering Quill",
    "Chapter 1: A Letter Under Lamplight",
    "Chapter 2: The Map of Margins",
    "Chapter 3: Ink-Stained Secrets",
  ],
};

const NovelDetails = () => {
  const { id } = useParams();
  const [novel, setNovel] = useState(null);
  const { addToLibrary } = useUser();
  const handleAddToLibrary = () => {
  addToLibrary({
    id: novel.id,
    title: novel.title,
    author: novel.author,
    cover: novel.cover,
  });
};


  useEffect(() => {
    // TODO: fetch real data using ID
    setNovel(mockNovel);
  }, [id]);

  if (!novel) return <div className="text-center pt-24 text-white">Loading...</div>;

  return (
    <div className="pt-28 px-6 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 bg-white/5 p-6 rounded-xl shadow-lg mb-8">
        <img
          src={novel.cover}
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
           <Link to={`/read/${novel.id}/1`}>
            <button className="bg-mutedGreen hover:bg-green-700 px-4 py-2 rounded transition">
                📖 Read Now
            </button>
            </Link>
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
        <ul className="space-y-2">
          {novel.toc.map((chapter, idx) => (
            <li key={idx} className="border-b border-white/10 pb-2">
                <Link to={`/read/${novel.id}/${idx + 1}`} className="block text-left w-full hover:underline text-blue-300">
                {chapter}
                </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NovelDetails;

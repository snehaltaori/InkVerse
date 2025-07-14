import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const chaptersMock = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Chapter ${i + 1}: The Whispering Walls`,
  content: `This is the content of chapter ${i + 1}. 
It’s written in a mysterious and poetic tone to match the dark academia vibe.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Nullam tincidunt, eros ut ultrices porttitor, ex arcu blandit sem...`,
}));

const ReadPage = () => {
  const { id, chapterId } = useParams(); // novel ID and chapter number
  const navigate = useNavigate();
  const chapterIndex = parseInt(chapterId) - 1;

  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    // Simulate fetch
    if (chapterIndex >= 0 && chapterIndex < chaptersMock.length) {
      setChapter(chaptersMock[chapterIndex]);
    } else {
      setChapter(null);
    }
    window.scrollTo(0, 0); // scroll to top on change
  }, [chapterId]);

  if (!chapter) {
    return <div className="pt-24 px-6 text-white">Chapter not found.</div>;
  }

  return (
    <div className="pt-24 px-6 pb-16 text-white max-w-3xl mx-auto leading-relaxed">
      <h2 className="text-2xl md:text-3xl font-semibold mb-2">{chapter.title}</h2>
      <p className="text-mutedGreen mb-6 italic">By Author Name • Chapter {chapter.id}</p>

      <div className="whitespace-pre-line text-lg bg-white/5 p-6 rounded-lg shadow">
        {chapter.content}
      </div>

      <div className="flex justify-between mt-8">
        <button
          disabled={chapterIndex === 0}
          onClick={() => navigate(`/read/${id}/${chapterIndex}`)}
          className={`px-4 py-2 rounded ${chapterIndex === 0 ? "bg-gray-600 cursor-not-allowed" : "bg-mutedGreen hover:bg-opacity-80"}`}
        >
          ← Previous
        </button>
        <button
          disabled={chapterIndex === chaptersMock.length - 1}
          onClick={() => navigate(`/read/${id}/${chapterIndex + 2}`)}
          className={`px-4 py-2 rounded ${chapterIndex === chaptersMock.length - 1 ? "bg-gray-600 cursor-not-allowed" : "bg-mutedGreen hover:bg-opacity-80"}`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default ReadPage;

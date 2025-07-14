import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q")?.toLowerCase() || "";
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const novelsPerPage = 15;

  useEffect(() => {
    // Simulated fetch — in real app, filter from backend
    const allNovels = Array.from({ length: 60 }, (_, i) => ({
      id: i + 1,
      title: `Novel Title ${i + 1}`,
      author: `Author ${i + 1}`,
      tags: ["romance", "fantasy", "drama", "poetry"][i % 4],
      description: "A gripping tale set in a world of shadows and secrets.",
      cover: "https://placehold.co/100x150",
    }));

    const filtered = allNovels.filter(novel =>
      novel.title.toLowerCase().includes(query) ||
      novel.author.toLowerCase().includes(query) ||
      novel.tags.toLowerCase().includes(query)
    );

    setResults(filtered);
    setCurrentPage(1); // reset to first page
  }, [query]);

  const indexOfLast = currentPage * novelsPerPage;
  const indexOfFirst = indexOfLast - novelsPerPage;
  const currentNovels = results.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(results.length / novelsPerPage);

  return (
    <div className="pt-24 px-6 text-white">
      <h2 className="text-2xl mb-4">Search Results for "<span className="italic">{query}</span>"</h2>

      {results.length === 0 ? (
        <p>No novels found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {currentNovels.map((novel) => (
              <Link
                key={novel.id}
                to={`/novel/${novel.id}`}
                className="flex bg-white/5 p-4 rounded-lg hover:bg-white/10 transition"
              >
                <img src={novel.cover} alt={novel.title} className="w-24 h-auto mr-4 rounded" />
                <div>
                  <h3 className="text-lg font-bold">{novel.title}</h3>
                  <p className="text-sm text-mutedGreen mb-1">{novel.author}</p>
                  <p className="text-sm line-clamp-3">{novel.description}</p>
                  <button className="text-sm text-blue-400 mt-1">See more</button>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded ${
                  num === currentPage ? "bg-green-700 text-white" : "bg-white/10"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;

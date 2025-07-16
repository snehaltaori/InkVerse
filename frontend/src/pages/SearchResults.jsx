import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API from "../utils/api";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q")?.toLowerCase() || "";
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const novelsPerPage = 15;
  
  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      try {
        const res = await API.get(`/novels/search?q=${query}`);
        setResults(res.data.novels);
        setCurrentPage(1);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    fetchSearchResults();
  }, [query]);

  const indexOfLast = currentPage * novelsPerPage;
  const indexOfFirst = indexOfLast - novelsPerPage;
  const currentNovels = results.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(results.length / novelsPerPage);
  

  return (
    <div className="pt-24 px-6 text-white">
      <h2 className="text-2xl mb-4">
        Search Results for "<span className="italic">{query}</span>"
      </h2>

      {results.length === 0 ? (
        <p>No novels found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {currentNovels.map((novel) => (
              <Link
                key={novel._id}
                to={`/novel/${novel._id}`}
                className="flex bg-white/5 p-4 rounded-lg hover:bg-white/10 transition"
              >
                <img
                  src={novel.cover}
                  alt={novel.title}
                  className="w-24 h-auto mr-4 rounded"
                />
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
                  num === currentPage ? "bg-mutedGreen text-white" : "bg-white/10"
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

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TagNovels = () => {
  const { tagName } = useParams();
  const [allNovels, setAllNovels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const novelsPerPage = 15;

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const res = await axios.get(`/api/novels/tags/${tagName}?page=${currentPage}`);
        setAllNovels(res.data.novels);
        setTotalPages(Math.ceil(res.data.total / novelsPerPage));
      } catch (err) {
        console.error("Failed to fetch novels by tag", err);
      }
    };

    fetchNovels();
    window.scrollTo(0, 0);
  }, [tagName, currentPage]);

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  return (
    <div className="pt-24 px-6 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">
        Results for tag: <span className="text-mutedGreen capitalize">{tagName}</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {allNovels.map((novel) => (
          <Link
            key={novel._id}
            to={`/novel/${novel._id}`}
            className="flex bg-white/5 p-4 rounded-lg hover:bg-white/10 transition"
          >
            <img src={novel.coverImage} alt={novel.title} className="w-24 h-auto mr-4 rounded" />
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
      <div className="flex justify-center gap-3 mb-12">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx + 1}
            onClick={() => handlePageClick(idx + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === idx + 1
                ? "bg-mutedGreen text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagNovels;

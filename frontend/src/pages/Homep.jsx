import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const genres = [
  "Romance", "Fantasy", "Mystery", "Drama", "Horror",
  "Sci-Fi", "Thriller", "Historical", "Poetry", "Adventure"
];

const Homep = () => {
  const [allNovels, setAllNovels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const novelsPerPage = 15;

  useEffect(() => {
    // Replace this with real API call
    const dummyNovels = Array.from({ length: 60 }, (_, idx) => ({
      id: idx + 1,
      title: `Novel Title ${idx + 1}`,
      author: `Author ${idx + 1}`,
      cover: "https://placehold.co/100x150",
      description: "A dark academia themed novel that blends mystery and elegance.",
    }));
    setAllNovels(dummyNovels);
  }, []);

  const totalPages = Math.ceil(allNovels.length / novelsPerPage);
  const indexOfLast = currentPage * novelsPerPage;
  const indexOfFirst = indexOfLast - novelsPerPage;
  const currentNovels = allNovels.slice(indexOfFirst, indexOfLast);

  const handlePageClick = (num) => {
    setCurrentPage(num);
    window.scrollTo(0, 0);
  };

  return (
    <div className="pt-24 px-6">
      {/* Genres */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {genres.map((tag, idx) => (
          <Link
            to={`/tags/${tag.toLowerCase()}`}
            key={idx}
            className="bg-mutedGreen px-4 py-1 rounded-full text-white hover:bg-opacity-80 transition"
          >
            {tag}
          </Link>
        ))}
      </div>

      {/* Slider */}
      <motion.div
        className="h-[20vh] bg-cover bg-center mb-8 rounded-lg shadow-md"
        style={{ backgroundImage: `url('/dark-academia-slider.jpg')` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="h-full w-full bg-black/40 flex items-center justify-center rounded-lg">
          <h2 className="text-3xl font-cursive text-white">“Ink bleeds beauty”</h2>
        </div>
      </motion.div>

      {/* Novels Grid */}
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

      {/* Popular & New */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 p-4 rounded-lg">
          <h4 className="text-xl font-semibold mb-3">🔥 Popular Searches</h4>
          {["Book A", "Book B", "Book C", "Book D", "Book E"].map((book, idx) => (
            <Link key={idx} to="#" className="block text-sm text-blue-300 hover:underline mb-1">
              {book}
            </Link>
          ))}
        </div>
        <div className="bg-white/5 p-4 rounded-lg">
          <h4 className="text-xl font-semibold mb-3">🆕 Newly Added</h4>
          {["New Book 1", "New Book 2", "New Book 3", "New Book 4", "New Book 5"].map((book, idx) => (
            <Link key={idx} to="#" className="block text-sm text-blue-300 hover:underline mb-1">
              {book}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 font-cursive text-mutedGreen italic">
        “A room without books is like a body without a soul.”
      </footer>
    </div>
  );
};

export default Homep;

// src/pages/Studio.jsx
import { useState, useEffect } from "react";
import BookWorkspace from "./BookWorkspace";
import NewBookModal from "../components/NewBookModal";
import API from "../utils/api";
import { FiSidebar } from "react-icons/fi";
import EditBookModal from "../components/EditBookModal";



export default function Studio() {
    const [selectedBook, setSelectedBook] = useState(null);
    const [books, setBooks] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editBook, setEditBook] = useState(null);


    const loadBooks = async () => {
        try {
            const res = await API.get("/novels/mine");
            setBooks(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setBooks([]);
        }
    };

    const createBook = async () => {
        const title = prompt("Enter book title:");
        if (!title || !title.trim()) return;

        try {
            const res = await API.post("/novels", { title: title.trim() });
            setBooks((prev) => [...prev, res.data]);
        } catch {
            alert("Failed to create novel");
        }
    };


    useEffect(() => {
        loadBooks();
    }, []);

    useEffect(() => {
        if (books.length && !selectedBook) {
            setSelectedBook(books[0]);
        }
    }, [books]);


    return (
        <div className="flex h-[calc(100vh-60px)] bg-[#1a1a1a] text-white pt-20 relative">

            {showModal && (
                <NewBookModal
                    onClose={() => setShowModal(false)}
                    onCreated={(book) => {
                        setBooks(prev => [...prev, book]);
                        setSelectedBook(book);
                    }}
                />
            )}



            <aside
                className={`transition-all duration-300 ease-in-out
                      border-r border-mutedGreen/30 bg-[#161616]
                      ${sidebarOpen ? "w-72" : "w-14"}
                      flex flex-col`}
                   >
                {/* HEADER — hamburger ALWAYS visible */}
                <div className="flex items-center justify-center px-3 h-14 border-b border-mutedGreen/20">
                    <button
                        onClick={() => setSidebarOpen(o => !o)}
                        className="p-2 rounded-md border border-mutedGreen/30
                 text-mutedGreen hover:bg-mutedGreen/10 transition"
                        title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        ☰
                    </button>
                </div>

                {/* CONTENT — hide ONLY when collapsed */}
                {sidebarOpen && (
                    <div className="flex-1 p-4 overflow-y-auto">
                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full py-2 mb-6 border border-mutedGreen/40
                            rounded-md text-mutedGreen hover:bg-mutedGreen/10 transition"
                        >
                            ➕ New Book
                        </button>


                        <div className="space-y-2">
                            {books.map(book => (
                                <div
                                    key={book._id}
                                    className={`relative p-3 border border-mutedGreen/20 rounded-md
                                    ${selectedBook?._id === book._id
                                            ? "bg-[#2a2a2a]"
                                            : "bg-[#1f1f1f]"}`}
                                     >
                                    <div
                                        onClick={() => setSelectedBook(book)}
                                        className="cursor-pointer"
                                    >
                                        <h3 className="font-serif text-lg">{book.title}</h3>
                                        <p className="text-sm text-mutedGreen">
                                            {book.chapterCount} chapters
                                        </p>
                                    </div>

                                    {/* ⋮ MENU */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditBook(book);
                                        }}
                                        className="
                                            absolute top-2 right-2
                                            text-mutedGreen hover:text-white
                                            text-xl
                                        "
                                        title="Edit book"
                                        >
                                        ⋮
                                    </button>
                                </div>

                            ))}
                        </div>
                    </div>
                )}
            </aside>


            <main className="flex-1 bg-[#141414] p-6 overflow-y-auto">
                {!selectedBook ? (
                    <div className="h-full flex items-center justify-center opacity-60 italic">
                        Your writing space awaits.
                    </div>
                ) : (
                    <BookWorkspace book={selectedBook} />
                )}

            </main>
            {editBook && (
                <EditBookModal
                    book={editBook}
                    onClose={() => setEditBook(null)}
                    onSaved={(updated) => {
                        setBooks(prev =>
                            prev.map(b => b._id === updated._id ? updated : b)
                        );
                        setEditBook(null);
                    }}
                />
            )}
        </div>
    );
}

import { useState } from "react";
import ChapterList from "./ChapterList";
import Editor from "./Editor";
import API from "../utils/api";
import ConfirmDialog from "../components/ConfirmDialog";

export default function BookWorkspace({ book }) {
    const [activeChapter, setActiveChapter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteBook, setDeleteBook] = useState(false);
    const [publishing, setPublishing] = useState(false);

    const handleSelectChapter = async (chapterId) => {
        try {
            setLoading(true);
            const res = await API.get(
                `/chapters/manage/chapter/${chapterId}`
            );
            setActiveChapter(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to load chapter");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* 🔹 Title + Actions */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-3xl tracking-wide text-[#f2f0ec]">
                    {book.title}
                </h2>

                <div className="flex items-center gap-3">
                    {/* Delete Book */}
                    <button
                        onClick={() => setDeleteBook(true)}
                        className="
                            px-3 py-2 rounded-md border
                            border-[#7a2e2e]
                            text-[#c46b6b]
                            hover:bg-[#7a2e2e]/20
                            transition
                            font-serif text-sm
                        "
                    >
                        🗑 Delete
                    </button>

                    {book.status !== "published" && (
                        <button
                            onClick={async () => {
                                await API.put(`/novels/${book._id}/publish`);
                                alert("Book published!");
                            }}
                            className="
                              px-4 py-2 rounded-md border
                              border-[#6b8f71]
                              text-[#9fc6a8]
                              hover:bg-[#6b8f71]/20
                              transition
                              font-serif text-sm
                            "
                        >
                            📜 Publish
                        </button>
                    )}

                </div>
            </div>

            {/* 🔹 Main content */}
            <div className="flex gap-6 flex-1 overflow-hidden">
                {/* Chapter list */}
                <aside className="w-64 overflow-y-auto">
                    <ChapterList
                        bookId={book._id}
                        onSelect={handleSelectChapter}
                    />
                </aside>

                {/* Editor */}
                <section className="flex-1 overflow-y-auto">
                    {loading && (
                        <div className="text-mutedGreen italic">
                            Loading chapter…
                        </div>
                    )}

                    {!activeChapter && !loading && (
                        <div className="text-mutedGreen italic opacity-60 h-full flex items-center justify-center">
                            Select a chapter to start writing
                        </div>
                    )}

                    {activeChapter && (
                        <Editor
                            key={activeChapter._id}
                            chapter={activeChapter}
                        />
                    )}
                </section>
            </div>

            {deleteBook && (
                <ConfirmDialog
                    title="Delete Book?"
                    message="This will permanently delete this book and all its chapters. This action cannot be undone."
                    confirmText="Delete Book"
                    onCancel={() => setDeleteBook(false)}
                    onConfirm={async () => {
                        try {
                            await API.delete(`/novels/${book._id}`);
                            setDeleteBook(false);
                            setActiveChapter(null);
                        } catch {
                            alert("Failed to delete book");
                            setDeleteBook(false);
                        }
                    }}
                />
            )}
        </div>
    );
}


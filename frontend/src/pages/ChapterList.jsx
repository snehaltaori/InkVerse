import { useState, useEffect } from "react";
import API from "../utils/api";
import ConfirmDialog from "../components/ConfirmDialog";

export default function ChapterList({ bookId, onSelect }) {
    const [chapters, setChapters] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);


    useEffect(() => {
        if (!bookId) return;

        const loadChapters = async () => {
            try {
                const res = await API.get(
                    `/chapters/manage/${bookId}`
                );
                setChapters(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        loadChapters();
    }, [bookId]);

    const createNewChapter = async () => {
        const title = prompt("Enter chapter title:");
        if (!title) return;

        try {
            const res = await API.post(
                `/chapters/manage/${bookId}`,
                { title }
            );
            setChapters((prev) => [...prev, res.data]);
        } catch (err) {
            console.error(err);
            alert("Failed to create chapter");
        }
    };

    const handleSelect = async (chapterId) => {
        try {
            onSelect(chapterId);
        } catch (err) {
            console.error(err);
            alert("Failed to load chapter");
        }
    };

    return (
        <div className="space-y-2">
            <button
                onClick={createNewChapter}
                className="w-full py-2 text-sm border border-mutedGreen/40
                 rounded-md text-mutedGreen hover:bg-mutedGreen/10 transition"
            >
                ➕ New Chapter
            </button>

            {chapters.map((c) => (
                <div
                    key={c._id}
                    className="
                      p-3 bg-[#1c1c1c]
                      border border-[#2f3a2f]
                      rounded-md
                      shadow-inner
                      hover:border-[#6b8f71]
                      transition
                    "

                >
                    <div
                        onClick={() => handleSelect(c._id)}
                        className="cursor-pointer"
                    >
                        <h4 className="font-serif">{c.title}</h4>
                        <span className="text-xs text-mutedGreen">{c.status}</span>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(c);
                        }}
                        className="
                        text-[#7a2e2e]
                        hover:text-[#c46b6b]
                        transition
                        font-serif
  "
                        title="Delete chapter"
                    >
                        ✒
                    </button>

                </div>
            ))}

            {deleteTarget && (
                <ConfirmDialog
                    title="Delete Chapter?"
                    message={`This will permanently delete "${deleteTarget.title}".`}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={async () => {
                        try {
                            await API.delete(
                                `/chapters/manage/chapter/${deleteTarget._id}`
                            );
                            setChapters(prev =>
                                prev.filter(c => c._id !== deleteTarget._id)
                            );
                        } catch (err) {
                            alert("Failed to delete chapter");
                        } finally {
                            setDeleteTarget(null);
                        }
                    }}
                />
            )}
        </div>
    );
}

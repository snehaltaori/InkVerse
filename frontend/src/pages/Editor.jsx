import { useState } from "react";
import API from "../utils/api";

export default function Editor({ chapter }) {
    const [title, setTitle] = useState(chapter.title || "");
    const [content, setContent] = useState(chapter.content || "");
    const [status, setStatus] = useState("Draft");

    const saveDraft = async () => {
        try {
            await API.put(
                `/chapters/manage/${chapter._id}/save`,
                { title, content }
            );
            setStatus("Saved ✓");
        } catch (err) {
            console.error(err);
            setStatus("Save failed");
        }
    };

    return (
        <div className="bg-[#1c1c1c] border border-mutedGreen/30 rounded-lg p-6">
            <input
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value);
                    setStatus("Draft");
                }}
                placeholder="Chapter title"
                className="w-full bg-transparent text-white font-serif text-2xl
                           mb-4 border-b border-mutedGreen/30 outline-none"
            />

            <textarea
                value={content}
                onChange={(e) => {
                    setContent(e.target.value);
                    setStatus("Draft");
                }}
                placeholder="Start writing…"
                className="w-full h-[60vh] bg-transparent text-white
                           font-serif resize-none outline-none"
            />

            <div className="mt-4 flex justify-between items-center text-mutedGreen text-sm">
                <button
                    onClick={saveDraft}
                    className="px-4 py-1 rounded-md border border-mutedGreen/40
                               hover:bg-mutedGreen/10 transition"
                >
                    Save Draft
                </button>

                <span className="italic">{status}</span>
            </div>
        </div>
    );
}

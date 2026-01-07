import { useState } from "react";
import API from "../utils/api";

export default function NewBookModal({ onClose, onCreated }) {
    const [title, setTitle] = useState("");
    const [coverTitle, setCoverTitle] = useState(""); // ✅ NEW
    const [summary, setSummary] = useState("");
    const [cover, setCover] = useState("");
    const [loading, setLoading] = useState(false);

    const uploadCover = async (file) => {
        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", "YOUR_PRESET"); // cloudinary preset

        const res = await fetch(
            "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
            { method: "POST", body: form }
        );

        const data = await res.json();
        setCover(data.secure_url);
    };

    const createBook = async () => {
        if (!title.trim()) return;

        try {
            setLoading(true);

            const res = await API.post("/novels", {
                title: title.trim(),
                coverTitle: coverTitle.trim(), // ✅ SEND TO BACKEND
                description: summary,
                coverImage: cover,
            });

            onCreated(res.data);
            onClose();
        } catch {
            alert("Failed to create book");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] w-[600px] rounded-lg p-6 flex gap-6 border border-mutedGreen/30">

                {/* Cover */}
                <label
                    className="
                        w-40 h-56 border border-mutedGreen/40 rounded-md
                        flex items-center justify-center cursor-pointer
                        bg-[#111] text-mutedGreen text-sm
                    "
                >
                    {cover ? (
                        <img
                            src={cover}
                            className="w-full h-full object-cover rounded-md"
                            alt="Cover preview"
                        />
                    ) : (
                        "Add Cover"
                    )}
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => uploadCover(e.target.files[0])}
                    />
                </label>

                {/* Info */}
                <div className="flex-1 space-y-4">
                    {/* Book title */}
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Book title *"
                        className="w-full p-2 bg-[#111] border border-mutedGreen/40 rounded"
                    />

                    {/* ✅ Cover title */}
                    <input
                        value={coverTitle}
                        onChange={(e) =>
                            setCoverTitle(e.target.value.slice(0, 22))
                        }
                        placeholder="Cover title (optional, max 22 chars)"
                        className="w-full p-2 bg-[#111] border border-mutedGreen/30 rounded
                                   text-sm placeholder:text-mutedGreen/50"
                    />

                    {/* Summary */}
                    <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Summary (optional)"
                        rows={5}
                        className="w-full p-2 bg-[#111] border border-mutedGreen/40 rounded"
                    />

                    <button
                        disabled={!title.trim() || loading}
                        onClick={createBook}
                        className="
                            px-4 py-2 border border-mutedGreen text-mutedGreen
                            rounded hover:bg-mutedGreen/10 disabled:opacity-40
                        "
                    >
                        {loading ? "Creating…" : "Create Book"}
                    </button>
                </div>
            </div>
        </div>
    );
}

import { useState } from "react";
import API from "../utils/api";

export default function EditBookModal({ book, onClose, onSaved }) {
    const [title, setTitle] = useState(book.title || "");
    const [coverTitle, setCoverTitle] = useState(book.coverTitle || "");
    const [description, setDescription] = useState(book.description || "");
    const [tags, setTags] = useState(book.tags?.join(", ") || "");
    const [coverImage, setCoverImage] = useState(book.coverImage || "");
    const [loading, setLoading] = useState(false);

    const saveChanges = async () => {
        try {
            setLoading(true);

            const res = await API.put(`/novels/${book._id}`, {
                title,
                coverTitle,
                description,
                tags: tags
                    .split(",")
                    .map(t => t.trim())
                    .filter(Boolean),
                coverImage
            });

            onSaved(res.data);
        } catch (err) {
            alert("Failed to update book");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#161616] w-[520px] rounded-xl p-6 border border-mutedGreen/30">

                <h3 className="font-serif text-xl mb-4">Edit Book</h3>

                <div className="space-y-3">
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Book title"
                        className="w-full p-2 bg-[#111] border border-mutedGreen/40 rounded"
                    />

                    <input
                        value={coverTitle}
                        onChange={e => setCoverTitle(e.target.value)}
                        placeholder="Cover title (short, optional)"
                        maxLength={22}
                        className="w-full p-2 bg-[#111] border border-mutedGreen/40 rounded"
                    />

                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Summary"
                        rows={4}
                        className="w-full p-2 bg-[#111] border border-mutedGreen/40 rounded"
                    />

                    <input
                        value={tags}
                        onChange={e => setTags(e.target.value)}
                        placeholder="Tags (comma separated)"
                        className="w-full p-2 bg-[#111] border border-mutedGreen/40 rounded"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm border border-white/20 rounded hover:bg-white/10"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={loading}
                        onClick={saveChanges}
                        className="px-4 py-2 text-sm border border-mutedGreen text-mutedGreen rounded hover:bg-mutedGreen/10"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

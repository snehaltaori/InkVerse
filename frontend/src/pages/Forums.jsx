import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";

const Forums = () => {
    const [threads, setThreads] = useState([]);
    const [newThread, setNewThread] = useState({ title: "", content: "" });
    const [reply, setReply] = useState({});

    useEffect(() => {
        fetchThreads();
    }, []);

    const fetchThreads = async () => {
        try {
            const res = await API.get("/forums");
            setThreads(res.data);
        } catch {
            alert("Failed to load threads");
        }
    };

    const handleThreadPost = async (e) => {
        e.preventDefault();
        try {
            await API.post("/forums", newThread);
            setNewThread({ title: "", content: "" });
            fetchThreads();
        } catch {
            alert("Login required to post");
        }
    };

    const handleReply = async (e, threadId) => {
        e.preventDefault();
        try {
            await API.post(`/forums/${threadId}/reply`, {
                message: reply[threadId],
            });
            setReply({ ...reply, [threadId]: "" });
            fetchThreads();
        } catch {
            alert("Login required to reply");
        }
    };

    return (
        <div className="pt-28 px-6 min-h-screen text-white">
            <h2 className="text-2xl font-bold mb-6">💭 Forums</h2>

            {/* New Thread */}
            <div className="bg-white/5 p-6 rounded-xl mb-8">
                <h3 className="text-xl mb-4">📝 Start a New Thread</h3>
                <form onSubmit={handleThreadPost} className="space-y-4">
                    <input
                        placeholder="Thread title"
                        value={newThread.title}
                        onChange={(e) =>
                            setNewThread({ ...newThread, title: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-white/10 rounded"
                        required
                    />
                    <textarea
                        rows="3"
                        placeholder="Thread content"
                        value={newThread.content}
                        onChange={(e) =>
                            setNewThread({ ...newThread, content: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-white/10 rounded"
                        required
                    />
                    <button className="w-full py-2 bg-mutedGreen rounded">
                        Post Thread
                    </button>
                </form>
            </div>

            {/* Threads */}
            <div className="space-y-6">
                {threads.map((thread) => (
                    <div key={thread._id} className="bg-white/5 p-5 rounded">
                        <h4 className="font-bold">{thread.title}</h4>
                        <p className="text-sm text-mutedGreen">
                            by{" "}
                            <Link to={`/user/${thread.author.username}`} className="underline">
                                {thread.author.username}
                            </Link>
                        </p>

                        <p className="my-3">{thread.content}</p>

                        {/* Replies */}
                        <div className="pl-4 border-l border-mutedGreen/30 space-y-2">
                            {thread.replies?.map((rep) => (
                                <div key={rep._id}>
                                    <p className="text-sm text-mutedGreen">
                                        {rep.author.username}
                                    </p>
                                    <p className="text-sm">{rep.message}</p>
                                </div>
                            ))}
                        </div>

                        {/* Reply Box */}
                        <form
                            onSubmit={(e) => handleReply(e, thread._id)}
                            className="mt-3 space-y-2"
                        >
                            <textarea
                                rows="2"
                                value={reply[thread._id] || ""}
                                onChange={(e) =>
                                    setReply({ ...reply, [thread._id]: e.target.value })
                                }
                                placeholder="Write a reply..."
                                className="w-full px-4 py-2 bg-white/10 rounded"
                            />
                            <button className="px-4 py-1 bg-mutedGreen rounded text-sm">
                                Reply
                            </button>
                        </form>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Forums;

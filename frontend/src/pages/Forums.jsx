import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/api";

const Forums = () => {
  const [threads, setThreads] = useState([]);
  const [newThread, setNewThread] = useState({ title: "", content: "" });
  const [reply, setReply] = useState({});

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const res = await axios.get("/forums");
      setThreads(res.data);
    } catch {
      alert("Failed to load threads");
    }
  };

  const handleThreadPost = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/forums", newThread);
      setNewThread({ title: "", content: "" });
      fetchThreads();
    } catch {
      alert("Failed to post thread");
    }
  };

  const handleReply = async (e, threadId) => {
    e.preventDefault();
    try {
      await axios.post(`/forums/${threadId}/reply`, {
        message: reply[threadId],
      });
      setReply({ ...reply, [threadId]: "" });
      fetchThreads();
    } catch {
      alert("Failed to reply");
    }
  };

  return (
    <div className="pt-28 px-6 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">💭 Forums</h2>

      {/* New Thread */}
      <div className="bg-white/5 p-6 rounded-xl mb-8">
        <h3 className="text-xl font-semibold mb-4">📝 Start a New Thread</h3>
        <form onSubmit={handleThreadPost} className="space-y-4">
          <input
            type="text"
            placeholder="Thread title"
            value={newThread.title}
            onChange={(e) =>
              setNewThread({ ...newThread, title: e.target.value })
            }
            className="w-full px-4 py-2 bg-white/10 text-white rounded outline-none"
            required
          />
          <textarea
            placeholder="Write your thread content here..."
            value={newThread.content}
            onChange={(e) =>
              setNewThread({ ...newThread, content: e.target.value })
            }
            className="w-full px-4 py-2 bg-white/10 text-white rounded outline-none"
            rows="3"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-mutedGreen rounded hover:bg-green-700 transition"
          >
            Post Thread
          </button>
        </form>
      </div>

      {/* Threads List */}
      <div className="space-y-6">
        {threads.map((thread) => (
          <div key={thread._id} className="bg-white/5 p-5 rounded shadow">
            <h4 className="text-lg font-bold">{thread.title}</h4>
            <p className="text-sm text-mutedGreen mb-1">
              by{" "}
              <Link
                to={`/user/${thread.author.username}`}
                className="hover:underline"
              >
                {thread.author.username}
              </Link>
            </p>
            <p className="mb-3">{thread.content}</p>

            {/* Replies */}
            <div className="pl-4 border-l-2 border-mutedGreen/30 space-y-2 mb-4">
              {thread.replies.map((rep) => (
                <div key={rep._id}>
                  <p className="text-sm text-mutedGreen">
                    <Link
                      to={`/user/${rep.author.username}`}
                      className="hover:underline"
                    >
                      {rep.author.username}
                    </Link>
                  </p>
                  <p className="text-sm">{rep.message}</p>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            <form onSubmit={(e) => handleReply(e, thread._id)} className="space-y-2">
              <textarea
                rows="2"
                value={reply[thread._id] || ""}
                onChange={(e) =>
                  setReply({ ...reply, [thread._id]: e.target.value })
                }
                placeholder="Write a reply..."
                className="w-full px-4 py-2 bg-white/10 text-white rounded outline-none"
              ></textarea>
              <button
                type="submit"
                className="px-4 py-1 bg-mutedGreen rounded hover:bg-green-700 text-sm"
              >
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

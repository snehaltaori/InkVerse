import { useState } from "react";

const Forums = () => {
  const [threads, setThreads] = useState([
    {
      id: 1,
      title: "Favorite Dark Academia Book?",
      author: "elena@inkverse.com",
      content: "I recently finished ‘The Secret History’ and I’m obsessed. Any recommendations?",
      replies: [
        {
          id: 1,
          author: "marcus@inkverse.com",
          content: "Try ‘If We Were Villains’ – total vibes!",
        },
      ],
    },
    {
      id: 2,
      title: "Writing Tips for New Authors?",
      author: "julian@inkverse.com",
      content: "How do you deal with writer's block?",
      replies: [],
    },
  ]);

  const [newThread, setNewThread] = useState({ title: "", content: "" });
  const [reply, setReply] = useState({});

  const handleThreadPost = (e) => {
    e.preventDefault();
    const newId = threads.length + 1;
    setThreads([
      ...threads,
      {
        id: newId,
        title: newThread.title,
        author: "you@inkverse.com",
        content: newThread.content,
        replies: [],
      },
    ]);
    setNewThread({ title: "", content: "" });
  };

  const handleReply = (e, threadId) => {
    e.preventDefault();
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              replies: [
                ...t.replies,
                {
                  id: t.replies.length + 1,
                  author: "you@inkverse.com",
                  content: reply[threadId],
                },
              ],
            }
          : t
      )
    );
    setReply({ ...reply, [threadId]: "" });
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
            onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
            className="w-full px-4 py-2 bg-white/10 text-white rounded outline-none"
            required
          />
          <textarea
            placeholder="Write your thread content here..."
            value={newThread.content}
            onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
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
          <div key={thread.id} className="bg-white/5 p-5 rounded shadow">
            <h4 className="text-lg font-bold">{thread.title}</h4>
            <p className="text-sm text-mutedGreen mb-1">by {thread.author}</p>
            <p className="mb-3">{thread.content}</p>

            {/* Replies */}
            <div className="pl-4 border-l-2 border-mutedGreen/30 space-y-2 mb-4">
              {thread.replies.map((rep) => (
                <div key={rep.id}>
                  <p className="text-sm text-mutedGreen">{rep.author}</p>
                  <p className="text-sm">{rep.content}</p>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            <form onSubmit={(e) => handleReply(e, thread.id)} className="space-y-2">
              <textarea
                rows="2"
                value={reply[thread.id] || ""}
                onChange={(e) => setReply({ ...reply, [thread.id]: e.target.value })}
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

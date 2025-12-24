const Thread = require("../models/Thread");

// Get all threads
exports.getAllThreads = async (req, res) => {
    try {
        const threads = await Thread.find()
            .populate("author", "username profilePic")
            .sort({ createdAt: -1 });

        res.json(threads);
    } catch {
        res.status(500).json({ error: "Failed to fetch threads" });
    }
};

// Create a new thread
exports.createThread = async (req, res) => {
    const { title, content } = req.body;
    try {
        const thread = new Thread({
            author: req.user.id,
            title,
            content,
        });
        await thread.save();
        res.status(201).json(thread);
    } catch {
        res.status(500).json({ error: "Failed to create thread" });
    }
};

// Get thread by ID (with replies)
exports.getThreadById = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.id)
            .populate("author", "username profilePic")
            .populate("replies.author", "username profilePic");

        if (!thread) return res.status(404).json({ error: "Thread not found" });

        res.json(thread);
    } catch {
        res.status(500).json({ error: "Failed to get thread" });
    }
};

// Add a reply
exports.addReply = async (req, res) => {
    const { message } = req.body;
    try {
        const thread = await Thread.findById(req.params.id);
        if (!thread) return res.status(404).json({ error: "Thread not found" });

        thread.replies.push({
            author: req.user.id,
            message,
        });
        await thread.save();

        const updated = await Thread.findById(req.params.id)
            .populate("author", "username profilePic")
            .populate("replies.author", "username profilePic");

        res.json(updated);
    } catch {
        res.status(500).json({ error: "Failed to add reply" });
    }
};

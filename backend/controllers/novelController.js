const Novel = require("../models/Novel");


/* ============================================
   Get all novels (paginated)
   GET /api/novels?page=1
============================================ */
const getAllNovels = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    try {
        const novels = await Novel.find()
            .populate("author", "username")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Novel.countDocuments();
        res.json({ novels, total });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

/* ============================================
   Search novels
   GET /api/novels/search?q=romance&page=1
============================================ */
const searchNovels = async (req, res) => {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    try {
        const regex = new RegExp(query, "i");

        const novels = await Novel.find({
            $or: [{ title: regex }, { tags: regex }],
        })
            .populate("author", "username")
            .skip(skip)
            .limit(limit);

        await Novel.updateMany(
            { $or: [{ title: regex }, { tags: regex }] },
            { $inc: { searchCount: 1 } }
        );

        res.json({ novels });
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
};

/* ============================================
   Popular novels
   GET /api/novels/popular
============================================ */
const getPopularNovels = async (req, res) => {
    try {
        const novels = await Novel.find()
            .populate("author", "username")
            .sort({ searchCount: -1, viewCount: -1 })
            .limit(6);

        res.json(novels);
    } catch {
        res.status(500).json({ error: "Failed to fetch popular novels" });
    }
};

/* ============================================
   Newly added novels
   GET /api/novels/new
============================================ */
const getNewlyAddedNovels = async (req, res) => {
    try {
        const novels = await Novel.find()
            .populate("author", "username")
            .sort({ createdAt: -1 })
            .limit(6);

        res.json(novels);
    } catch {
        res.status(500).json({ error: "Failed to fetch new novels" });
    }
};

/* ============================================
   Novel details (NO chapters here)
   GET /api/novels/:id
============================================ */
const getNovelById = async (req, res) => {
    try {
        const novel = await Novel.findById(req.params.id)
            .populate("author", "username");

        if (!novel) {
            return res.status(404).json({ error: "Novel not found" });
        }

        novel.viewCount += 1;
        await novel.save();

        res.json({
            _id: novel._id,
            title: novel.title,
            description: novel.description,
            author: novel.author.username,
            tags: novel.tags,
            coverImage: novel.coverImage,
            viewCount: novel.viewCount,
            createdAt: novel.createdAt,
        });
    } catch {
        res.status(500).json({ error: "Server error" });
    }
};

/* ============================================
   Novels by tag
   GET /api/novels/tags/:tag?page=1
============================================ */
const getNovelsByTag = async (req, res) => {
    const { tag } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    try {
        const novels = await Novel.find({
            tags: { $regex: new RegExp(tag, "i") },
        })
            .populate("author", "username")
            .skip(skip)
            .limit(limit);

        const total = await Novel.countDocuments({
            tags: { $regex: new RegExp(tag, "i") },
        });

        res.json({ novels, total });
    } catch {
        res.status(500).json({ error: "Failed to fetch novels by tag" });
    }
};

module.exports = {
    getAllNovels,
    searchNovels,
    getPopularNovels,
    getNewlyAddedNovels,
    getNovelById,
    getNovelsByTag,
};


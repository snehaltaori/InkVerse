const Novel = require("../models/Novel");
const Chapter = require("../models/Chapter");

const getAllNovels = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    try {
        const novels = await Novel.find({ status: "published" })
            .populate("author", "username")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Novel.countDocuments({ status: "published" });
        res.json({ novels, total });
    } catch {
        res.status(500).json({ error: "Server error" });
    }
};

const searchNovels = async (req, res) => {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    try {
        const regex = new RegExp(query, "i");

        const novels = await Novel.find({
            status: "published",
            $or: [{ title: regex }, { tags: regex }],
        })
            .populate("author", "username")
            .skip(skip)
            .limit(limit);

        res.json({ novels });
    } catch {
        res.status(500).json({ error: "Search failed" });
    }
};

const getPopularNovels = async (req, res) => {
    try {
        const novels = await Novel.find({ status: "published" })
            .populate("author", "username")
            .sort({ viewCount: -1 })
            .limit(6);

        res.json(novels);
    } catch {
        res.status(500).json({ error: "Failed to fetch popular novels" });
    }
};

const getNewlyAddedNovels = async (req, res) => {
    try {
        const novels = await Novel.find({ status: "published" })
            .populate("author", "username")
            .sort({ createdAt: -1 })
            .limit(6);

        res.json(novels);
    } catch {
        res.status(500).json({ error: "Failed to fetch new novels" });
    }
};

const getNovelById = async (req, res) => {
    try {
        const novel = await Novel.findById(req.params.id)
            .populate("author", "username profilePic");

        if (!novel) {
            return res.status(404).json({ error: "Novel not found" });
        }

        novel.viewCount += 1;
        await novel.save();

        res.json({
            _id: novel._id,
            title: novel.title,
            coverTitle: novel.coverTitle,
            description: novel.description,

            author: {
                _id: novel.author._id,
                username: novel.author.username,
                profilePic: novel.author.profilePic,
            },

            tags: novel.tags,
            coverImage: novel.coverImage,
            viewCount: novel.viewCount,
            createdAt: novel.createdAt,
        });
    } catch (err) {
        console.error("GET NOVEL ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};


const getNovelsByTag = async (req, res) => {
    const { tag } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    try {
        const novels = await Novel.find({
            status: "published",
            tags: { $regex: new RegExp(tag, "i") },
        })
            .populate("author", "username")
            .skip(skip)
            .limit(limit);

        const total = await Novel.countDocuments({
            status: "published",
            tags: { $regex: new RegExp(tag, "i") },
        });

        res.json({ novels, total });
    } catch {
        res.status(500).json({ error: "Failed to fetch novels by tag" });
    }
};

const createNovel = async (req, res) => {
    try {
        const { title, coverTitle = "" } = req.body;

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const novel = await Novel.create({
            title,
            coverTitle,             
            author: req.user.id,
            description: "",
            tags: [],
            coverImage: "",
            status: "draft",
        });

        res.status(201).json(novel);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create novel" });
    }
};

const getMyNovels = async (req, res) => {
    try {
        const novels = await Novel.find({ author: req.user.id })
            .sort({ createdAt: -1 })
            .lean();

        const novelIds = novels.map(n => n._id);

        const chapterCounts = await Chapter.aggregate([
            { $match: { novel: { $in: novelIds } } },
            { $group: { _id: "$novel", count: { $sum: 1 } } }
        ]);

        const countMap = {};
        chapterCounts.forEach(c => {
            countMap[c._id.toString()] = c.count;
        });

        const result = novels.map(novel => ({
            ...novel,
            chapterCount: countMap[novel._id.toString()] || 0,
        }));

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load novels" });
    }
};

const publishNovel = async (req, res) => {
    try {
        const novel = await Novel.findById(req.params.novelId);

        if (!novel) return res.status(404).json({ error: "Novel not found" });
        if (novel.author.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }

        novel.status = "published";
        await novel.save();

        await Chapter.updateMany(
            { novel: novel._id },
            { status: "published" }
        );

        res.json({ message: "Novel published successfully" });
    } catch (err) {
        console.error("PUBLISH NOVEL ERROR:", err);
        res.status(500).json({ error: "Failed to publish novel" });
    }
};

const deleteNovel = async (req, res) => {
    try {
        const novel = await Novel.findById(req.params.novelId);

        if (!novel) return res.status(404).json({ error: "Novel not found" });
        if (novel.author.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }

        await Chapter.deleteMany({ novel: novel._id });
        await novel.deleteOne();

        res.json({ message: "Novel deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete novel" });
    }
};
const updateNovel = async (req, res) => {
    try {
        const { title, coverTitle, description, tags, coverImage } = req.body;

        const novel = await Novel.findById(req.params.novelId);

        if (!novel) {
            return res.status(404).json({ error: "Novel not found" });
        }

        if (novel.author.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized" });
        }

        if (novel.status === "published") {
            return res.status(400).json({ error: "Published novels cannot be edited" });
        }

        novel.title = title;
        novel.coverTitle = coverTitle || "";
        novel.description = description || "";
        novel.tags = tags || [];
        novel.coverImage = coverImage || "";

        await novel.save();

        res.json(novel);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update novel" });
    }
};

module.exports = {
    getAllNovels,
    searchNovels,
    getPopularNovels,
    getNewlyAddedNovels,
    getNovelById,
    getNovelsByTag,
    createNovel,
    getMyNovels,
    publishNovel,
    deleteNovel,
    updateNovel,
};




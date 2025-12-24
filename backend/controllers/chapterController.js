const Chapter = require("../models/Chapter");

/* ============================================
   Get all published chapters of a novel (TOC)
   GET /api/chapters/novel/:novelId
============================================ */
exports.getChaptersByNovel = async (req, res) => {
    try {
        const chapters = await Chapter.find({
            novel: req.params.novelId,
            status: "published",
        })
            .select("_id title chapterNumber")
            .sort({ chapterNumber: 1 });

        res.json(chapters);
    } catch {
        res.status(500).json({ error: "Failed to fetch chapters" });
    }
};

/* ============================================
   Read first chapter (Read Now)
   GET /api/chapters/:novelId/first
============================================ */
exports.getFirstChapter = async (req, res) => {
    try {
        const chapter = await Chapter.findOne({
            novel: req.params.novelId,
            status: "published",
        }).sort({ chapterNumber: 1 });

        if (!chapter) {
            return res.status(404).json({ error: "No chapters found" });
        }

        res.json({ _id: chapter._id });
    } catch {
        res.status(500).json({ error: "Failed to fetch first chapter" });
    }
};

/* ============================================
   Read a chapter with prev / next
   GET /api/chapters/read/:chapterId
============================================ */
exports.getChapterById = async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.chapterId);

        if (!chapter || chapter.status !== "published") {
            return res.status(404).json({ error: "Chapter not found" });
        }

        const prev = await Chapter.findOne({
            novel: chapter.novel,
            chapterNumber: chapter.chapterNumber - 1,
            status: "published",
        }).select("_id");

        const next = await Chapter.findOne({
            novel: chapter.novel,
            chapterNumber: chapter.chapterNumber + 1,
            status: "published",
        }).select("_id");

        res.json({
            _id: chapter._id,
            title: chapter.title,
            content: chapter.content,
            novel: chapter.novel,

            hasPrev: !!prev,
            hasNext: !!next,
            prevChapterId: prev?._id || null,
            nextChapterId: next?._id || null,
        });
    } catch {
        res.status(500).json({ error: "Failed to load chapter" });
    }
};

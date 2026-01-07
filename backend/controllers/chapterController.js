const Chapter = require("../models/Chapter");

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
exports.getChaptersForAuthor = async (req, res) => {
    try {
        const chapters = await Chapter.find({ novel: req.params.novelId })
            .select("_id title chapterNumber status")
            .sort({ chapterNumber: 1 });

        res.json(chapters);
    } catch {
        res.status(500).json({ error: "Failed to fetch chapters" });
    }
};

exports.createChapter = async (req, res) => {
    const { novelId } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({ error: "Chapter title is required" });
    }

    try {
        const last = await Chapter.findOne({ novel: novelId })
            .sort({ chapterNumber: -1 });

        const nextNumber = last ? last.chapterNumber + 1 : 1;

        const chapter = await Chapter.create({
            novel: novelId,
            author: req.user.id,
            title: title.trim(),
            content: "",
            chapterNumber: nextNumber,
            status: "draft",
        });

        res.status(201).json(chapter);
    } catch (err) {
             console.error("CREATE CHAPTER ERROR:", err);
             res.status(500).json({
             error: err.message,
             name: err.name,
      });
    }
};


exports.saveChapter = async (req, res) => {
    const { chapterId } = req.params;
    const { title, content } = req.body;

    try {
        const chapter = await Chapter.findByIdAndUpdate(
            chapterId,
            { title, content },
            { new: true }
        );
        res.json(chapter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save chapter" });
    }
};

exports.getChapterForEdit = async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.chapterId);
        if (!chapter) {
            return res.status(404).json({ error: "Chapter not found" });
        }
        res.json(chapter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load chapter" });
    }
};

exports.deleteChapter = async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.chapterId);

        if (!chapter) {
            return res.status(404).json({ error: "Chapter not found" });
        }

        await chapter.deleteOne();
        res.json({ message: "Chapter deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete chapter" });
    }
};






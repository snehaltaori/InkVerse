const Novel = require("../models/Novel");

// Get all novels paginated (15 per page)
exports.getAllNovels = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const skip = (page - 1) * limit;

  try {
    const novels = await Novel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Novel.countDocuments();

    res.json({ novels, total });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Search novels by title, author, or tags
exports.searchNovels = async (req, res) => {
  const query = req.query.q;
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const skip = (page - 1) * limit;

  try {
    const regex = new RegExp(query, "i");

    const novels = await Novel.find({
      $or: [
        { title: regex },
        { author: regex },
        { tags: regex },
      ]
    })
      .skip(skip)
      .limit(limit);

    await Novel.updateMany(
      {
        $or: [
          { title: regex },
          { author: regex },
          { tags: regex },
        ]
      },
      { $inc: { searchCount: 1 } }
    );

    res.json({ novels });
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
};

// Get 6 most viewed novels
exports.getPopularNovels = async (req, res) => {
  try {
    const novels = await Novel.find()
      .sort({ searchCount: -1, viewCount: -1 })
      .limit(6);
    res.json(novels);
  } catch {
    res.status(500).json({ error: "Failed to fetch popular novels" });
  }
};

// Get 6 newly added novels
exports.getNewlyAddedNovels = async (req, res) => {
  try {
    const novels = await Novel.find()
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(novels);
  } catch {
    res.status(500).json({ error: "Failed to fetch new novels" });
  }
};
//NovelDetails
exports.getNovelById = async (req, res) => {
  const { id } = req.params;

  try {
    const novel = await Novel.findById(id);
    if (!novel) return res.status(404).json({ error: "Novel not found" });

    // Increment view count
    novel.viewCount += 1;
    await novel.save();

    // Send novel details (omit chapter content)
    const response = {
      _id: novel._id,
      title: novel.title,
      description: novel.description,
      author: novel.author,
      tags: novel.tags,
      coverImage: novel.coverImage,
      viewCount: novel.viewCount,
      createdAt: novel.createdAt,
      chapters: novel.chapters.map(chap => ({
        _id: chap._id,
        title: chap.title
      }))
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
//reading chapter page read now button
exports.getFirstChapter = async (req, res) => {
  const { novelId } = req.params;

  try {
    const novel = await Novel.findById(novelId);
    if (!novel || novel.chapters.length === 0)
      return res.status(404).json({ error: "No chapters found" });

    const first = novel.chapters[0];

    res.json({
      novelTitle: novel.title,
      chapterId: first._id,
      title: first.title,
      content: first.content,
      hasNext: novel.chapters.length > 1,
      hasPrev: false
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};
//chapter reading page via clicking any chapter
exports.getChapterById = async (req, res) => {
  const { novelId, chapterId } = req.params;

  try {
    const novel = await Novel.findById(novelId);
    if (!novel) return res.status(404).json({ error: "Novel not found" });

    const chapters = novel.chapters;
    const index = chapters.findIndex(ch => ch._id.toString() === chapterId);
    if (index === -1) return res.status(404).json({ error: "Chapter not found" });

    const chapter = chapters[index];

    const prevChapter = index > 0 ? chapters[index - 1] : null;
    const nextChapter = index < chapters.length - 1 ? chapters[index + 1] : null;

    res.json({
      novelTitle: novel.title,
      chapterId: chapter._id,
      title: chapter.title,
      content: chapter.content,
      hasPrev: !!prevChapter,
      hasNext: !!nextChapter,
      prevChapterId: prevChapter?._id || null,
      nextChapterId: nextChapter?._id || null
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};
// Get novels by tag
exports.getNovelsByTag = async (req, res) => {
  const { tag } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const skip = (page - 1) * limit;

  try {
    const novels = await Novel.find({ tags: { $regex: new RegExp(tag, "i") } })
      .skip(skip)
      .limit(limit);

    const total = await Novel.countDocuments({ tags: { $regex: new RegExp(tag, "i") } });

    res.json({ novels, total });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch novels by tag" });
  }
};

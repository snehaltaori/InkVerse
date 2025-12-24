const router = require("express").Router();
const {
    getChaptersByNovel,
    getFirstChapter,
    getChapterById,
} = require("../controllers/chapterController");

// ✅ MOST SPECIFIC FIRST
router.get("/read/:chapterId", getChapterById);

// then other routes
router.get("/novel/:novelId", getChaptersByNovel);
router.get("/:novelId/first", getFirstChapter);

module.exports = router;

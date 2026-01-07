const router = require("express").Router();
const auth = require("../middleware/auth");

const {
    getChaptersByNovel,
    getFirstChapter,
    getChapterById,
    getChaptersForAuthor,
    createChapter,
    saveChapter,
    getChapterForEdit,
    deleteChapter
} = require("../controllers/chapterController");

router.get("/read/:chapterId", getChapterById);

router.get("/novel/:novelId", getChaptersByNovel);
router.get("/:novelId/first", getFirstChapter);

router.get("/manage/:novelId", auth, getChaptersForAuthor);
router.post("/manage/:novelId", auth, createChapter);

router.get("/manage/chapter/:chapterId", auth, getChapterForEdit);
router.put("/manage/:chapterId/save", auth, saveChapter);

router.delete("/manage/chapter/:chapterId", auth, deleteChapter);
module.exports = router;

const router = require("express").Router();
const {
  getAllNovels,
  searchNovels,
  getPopularNovels,
  getNewlyAddedNovels,
  getNovelById,
  getFirstChapter,
  getChapterById,
  getNovelsByTag,
} = require("../controllers/novelController");

router.get("/", getAllNovels); // ?page=1
router.get("/search", searchNovels); // ?q=romance&page=1
router.get("/popular", getPopularNovels);
router.get("/new", getNewlyAddedNovels);
//noveldetails
router.get("/:id", getNovelById); // GET /api/novels/:id
//chapterreading
router.get("/:novelId/first-chapter", getFirstChapter);
router.get("/:novelId/chapters/:chapterId", getChapterById);
router.get("/tags/:tag", getNovelsByTag); // /api/novels/tags/romance?page=1

module.exports = router;


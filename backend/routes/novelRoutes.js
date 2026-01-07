const router = require("express").Router();
const auth = require("../middleware/auth");

const {
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
    updateNovel
} = require("../controllers/novelController");


// ⭐ Studio Routes (PROTECTED)
router.post("/", auth, createNovel);
router.get("/mine", auth, getMyNovels);

// ⭐ Public search & filter routes
router.get("/search", searchNovels);       // ?q=romance&page=1
router.get("/popular", getPopularNovels);
router.get("/new", getNewlyAddedNovels);
router.get("/tags/:tag", getNovelsByTag);

// ⭐ Get all novels (public browse) — MUST be after Studio routes
router.get("/", getAllNovels);             // ?page=1

// ⭐ Get a single novel — MUST stay last
router.get("/:id", getNovelById);
router.put("/:novelId/publish", auth, publishNovel);
router.delete("/:novelId", auth, deleteNovel);
router.put("/:novelId", auth, updateNovel);


module.exports = router;

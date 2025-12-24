const router = require("express").Router();
const {
    getAllNovels,
    searchNovels,
    getPopularNovels,
    getNewlyAddedNovels,
    getNovelById,
    getNovelsByTag,
} = require("../controllers/novelController");

router.get("/", getAllNovels); // ?page=1
router.get("/search", searchNovels); // ?q=romance&page=1
router.get("/popular", getPopularNovels);
router.get("/new", getNewlyAddedNovels);
router.get("/tags/:tag", getNovelsByTag);
router.get("/:id", getNovelById);


module.exports = router;


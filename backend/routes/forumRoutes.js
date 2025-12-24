const router = require("express").Router();
const auth = require("../middleware/auth");
const {
    getAllThreads,
    createThread,
    getThreadById,
    addReply
} = require("../controllers/forumController");

router.get("/", getAllThreads);                 // Public: View all threads
router.get("/:id", getThreadById);              // Public: View one thread with replies
router.post("/", auth, createThread);           // Auth: Create thread
router.post("/:id/reply", auth, addReply);      // Auth: Reply to thread

module.exports = router;

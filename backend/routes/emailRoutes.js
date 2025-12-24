const router = require("express").Router();
const auth = require("../middleware/auth");
const {
    sendEmail,
    getReceivedEmails,
    getSentEmails,
    getEmailById
} = require("../controllers/emailController");

router.post("/send", auth, sendEmail);
router.get("/inbox", auth, getReceivedEmails);
router.get("/sent", auth, getSentEmails);
router.get("/:id", auth, getEmailById);

module.exports = router;

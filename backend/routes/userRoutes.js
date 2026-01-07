const router = require("express").Router();
const auth = require("../middleware/auth");

const {
    addToLibrary,
    getLibrary,
    removeFromLibrary,
    getMyProfile,
    getUserByUsername,
    getUserById,            // 🔹 NEW
    followUser,
    unfollowUser,
    getFollowStates,
    updateProfilePic,
    changePassword
} = require("../controllers/userController");

// 📚 Library
router.post("/library/:novelId", auth, addToLibrary);
router.get("/library", auth, getLibrary);
router.delete("/library/:novelId", auth, removeFromLibrary);

// 👤 Profile
router.get("/me", auth, getMyProfile);
router.get("/:userId", auth, getUserById);            // 🔹 NEW (for /profile/:id)
router.get("/profile/:username", auth, getUserByUsername);

// 🤝 Follow system (username-based)
router.post("/follow/:username", auth, followUser);
router.post("/unfollow/:username", auth, unfollowUser);
router.post("/follow-state", auth, getFollowStates);

// ⚙️ Settings
router.put("/settings/profile-pic", auth, updateProfilePic);
router.put("/settings/password", auth, changePassword);

module.exports = router;


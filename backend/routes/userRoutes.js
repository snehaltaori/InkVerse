const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  addToLibrary,
  getLibrary,
  removeFromLibrary,
  getMyProfile,
  getUserByUsername,
  followUser,
  unfollowUser,
  getFollowStates,
  updateProfilePic,
  changePassword
} = require("../controllers/userController");

router.post("/library/:novelId", auth, addToLibrary);         // Add to library
router.get("/library", auth, getLibrary);                     // View library
router.delete("/library/:novelId", auth, removeFromLibrary);  // Remove from library
router.get("/me", auth, getMyProfile);
router.get("/profile/:username", auth, getUserByUsername);
router.post("/follow/:username", auth, followUser);
router.post("/unfollow/:username", auth, unfollowUser);
router.post("/follow-state", auth, getFollowStates);

router.put("/settings/profile-pic", auth, updateProfilePic);
router.put("/settings/password", auth, changePassword);


module.exports = router;

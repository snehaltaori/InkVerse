const User = require("../models/User");
const Novel = require("../models/Novel");

exports.addToLibrary = async (req, res) => {
    const userId = req.user.id;
    const { novelId } = req.params;

    try {
        const user = await User.findById(userId);
        const novel = await Novel.findById(novelId);

        if (!novel) return res.status(404).json({ error: "Novel not found" });

        const alreadyInLibrary = user.library.includes(novelId);
        if (alreadyInLibrary) {
            return res.status(400).json({ error: "Already in library" });
        }

        user.library.push(novelId);
        await user.save();

        res.json({ message: "Added to library" });
    } catch {
        res.status(500).json({ error: "Server error" });
    }
};

exports.getLibrary = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).populate("library");
        res.json(user.library);
    } catch {
        res.status(500).json({ error: "Failed to get library" });
    }
};

exports.removeFromLibrary = async (req, res) => {
    const userId = req.user.id;
    const { novelId } = req.params;

    try {
        const user = await User.findById(userId);
        user.library = user.library.filter(id => id.toString() !== novelId);
        await user.save();

        res.json({ message: "Removed from library" });
    } catch {
        res.status(500).json({ error: "Server error" });
    }
};
// profile page ..getting ur own profile page 
exports.getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate("library", "title coverImage")
            .populate("followers", "username profilePic")
            .populate("following", "username profilePic");

        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({
            _id: user._id,
            username: user.username,
            profilePic: user.profilePic,
            bio: user.bio,
            library: user.library,
            followers: user.followers,
            following: user.following
        });
    } catch {
        res.status(500).json({ error: "Failed to get profile" });
    }
};
// profile page ...other profile
exports.getUserByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username })
            .populate("library", "title coverImage")
            .populate("followers", "username profilePic")
            .populate("following", "username profilePic");

        if (!user) return res.status(404).json({ error: "User not found" });

        const isFollowing = req.user
            ? user.followers.some(f => f._id.toString() === req.user.id)
            : false;

        res.json({
            _id: user._id,
            username: user.username,
            profilePic: user.profilePic,
            bio: user.bio,
            library: user.library,
            followers: user.followers,
            following: user.following,
            isFollowing
        });
    } catch {
        res.status(500).json({ error: "Failed to get user" });
    }
};
//profile page -- following a user
exports.followUser = async (req, res) => {
    const targetUsername = req.params.username;

    try {
        const currentUser = await User.findById(req.user.id);
        const targetUser = await User.findOne({ username: targetUsername });

        if (!targetUser) return res.status(404).json({ error: "User not found" });
        if (targetUser._id.equals(currentUser._id)) return res.status(400).json({ error: "Cannot follow yourself" });

        // Avoid duplicate follows
        if (!currentUser.following.some(
            id => id.toString() === targetUser._id.toString()
        )) {

            currentUser.following.push(targetUser._id);
            targetUser.followers.push(currentUser._id);
            await currentUser.save();
            await targetUser.save();
        }

        res.json({ message: "Now following" });
    } catch {
        res.status(500).json({ error: "Failed to follow user" });
    }
};
// unfolloe  user
exports.unfollowUser = async (req, res) => {
    const targetUsername = req.params.username;

    try {
        const currentUser = await User.findById(req.user.id);
        const targetUser = await User.findOne({ username: targetUsername });

        if (!targetUser) return res.status(404).json({ error: "User not found" });

        currentUser.following = currentUser.following.filter(
            id => id.toString() !== targetUser._id.toString()
        );
        targetUser.followers = targetUser.followers.filter(
            id => id.toString() !== currentUser._id.toString()
        );

        await currentUser.save();
        await targetUser.save();

        res.json({ message: "Unfollowed" });
    } catch {
        res.status(500).json({ error: "Failed to unfollow user" });
    }
};
//followers/following states
exports.getFollowStates = async (req, res) => {
    const { ids } = req.body; // [userId1, userId2, ...]

    try {
        const currentUser = await User.findById(req.user.id);

        const result = await Promise.all(
            ids.map(async (id) => {
                const user = await User.findById(id);
                return {
                    _id: user._id,
                    username: user.username,
                    profilePic: user.profilePic,
                    isFollowing: currentUser.following.includes(user._id),
                    email: `${user.username}@InkVerse.com`
                };
            })
        );

        res.json(result);
    } catch {
        res.status(500).json({ error: "Failed to fetch follow states" });
    }
};

// settings page profilepic
exports.updateProfilePic = async (req, res) => {
    const { profilePic } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profilePic },
            { new: true }
        );

        res.json({ message: "Profile picture updated", profilePic: user.profilePic });
    } catch {
        res.status(500).json({ error: "Failed to update profile picture" });
    }
};
// settings change password
const bcrypt = require("bcryptjs");

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Incorrect current password" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch {
        res.status(500).json({ error: "Password update failed" });
    }
};


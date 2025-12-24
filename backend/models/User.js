const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    profilePic: {
        type: String,
        default: "https://res.cloudinary.com/your_cloud_name/image/upload/v123456/default_profile.png"
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    library: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Novel' }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

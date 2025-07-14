const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email:    { type: String, unique: true, required: true },
  password: { type: String, required: true },

  profilePic: {
    type: String,
    default: "https://placehold.co/100x100", // or your Cloudinary fallback
  },

  followers: { type: [String], default: [] },   // Array of usernames
  following: { type: [String], default: [] },   // Array of usernames

  library: [
    {
      id: String,
      title: String,
      author: String,
      cover: String, // Cloudinary image URL
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

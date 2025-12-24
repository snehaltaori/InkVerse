const mongoose = require("mongoose");

const novelSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: String,

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        tags: [String],
        coverImage: String,
        viewCount: { type: Number, default: 0 },
        searchCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Novel", novelSchema);

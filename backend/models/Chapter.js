const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema(
    {
        novel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Novel",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        content: {
            type: String,
            required: true,
        },

        chapterNumber: {
            type: Number,
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: ["published"],
            default: "published",
        },
    },
    { timestamps: true }
);

// Prevent duplicate chapter numbers per novel
ChapterSchema.index({ novel: 1, chapterNumber: 1 }, { unique: true });

module.exports = mongoose.model("Chapter", ChapterSchema);

const mongoose = require("mongoose");

const novelSchema = new mongoose.Schema({
    title: { type: String, required: true },

    coverTitle: {
        type: String,
        maxlength: 22,
        trim: true,
        default: ""
    },

    description: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tags: [String],
    coverImage: String,
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft",
    }
}, { timestamps: true });

module.exports = mongoose.model("Novel", novelSchema);

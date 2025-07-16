const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  title: String,
  content: String,
}, { timestamps: true });

const novelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  author: { type: String, required: true },
  tags: [String],
  coverImage: String,
  viewCount: { type: Number, default: 0 },
  searchCount: { type: Number, default: 0 },
  chapters: [chapterSchema],
}, { timestamps: true });

module.exports = mongoose.model("Novel", novelSchema);

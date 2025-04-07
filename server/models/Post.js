const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);

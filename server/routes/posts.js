const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({ status: "published" }).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/posts/slug/:slug
// @desc    Get post by slug
// @access  Public
router.get("/slug/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post("/", async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content,
      excerpt: req.body.excerpt,
      coverImage: req.body.coverImage,
      author: req.body.author,
      authorId: req.body.authorId,
      categories: req.body.categories,
      tags: req.body.tags,
      featured: req.body.featured,
      status: req.body.status,
    });

    const post = await newPost.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the author
    if (post.authorId !== req.body.authorId) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the author
    if (post.authorId !== req.body.authorId) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await post.remove();
    res.json({ message: "Post removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

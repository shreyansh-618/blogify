const express = require("express");
const router = express.Router();
const User = require("../models/User");

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ supabaseId: req.params.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/users
// @desc    Create or update user
// @access  Private
router.post("/", async (req, res) => {
  try {
    // Check if user exists
    let user = await User.findOne({ supabaseId: req.body.supabaseId });

    if (user) {
      // Update user
      user = await User.findOneAndUpdate(
        { supabaseId: req.body.supabaseId },
        req.body,
        { new: true }
      );
    } else {
      // Create new user
      user = new User({
        supabaseId: req.body.supabaseId,
        name: req.body.name,
        email: req.body.email,
        bio: req.body.bio || "",
        avatar: req.body.avatar || "",
        website: req.body.website || "",
      });

      await user.save();
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

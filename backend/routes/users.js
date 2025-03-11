const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { userId, email } = req.body;
    let user = await User.findOne({ userId });

    if (!user) {
      user = new User({ userId, email });
      await user.save();
    }
    res.json({ message: "User saved successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Error saving user" });
  }
});

module.exports = router;

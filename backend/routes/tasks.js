const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User"); // ✅ Import User model
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Add a new task (Protected)
router.post("/add", verifyToken, async (req, res) => {
  try {
    let user = await User.findOne({ userId: req.user.uid });

    // ✅ If user not found, create a new one (Fix)
    if (!user) {
      user = new User({ userId: req.user.uid, email: req.user.email });
      await user.save();
    }

    // ✅ Ensure task is correctly assigned to the authenticated user
    const task = new Task({ ...req.body, userId: req.user.uid });
    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Error adding task" });
  }
});

// ✅ Get tasks by userId (Protected)
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user.uid !== req.params.userId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const tasks = await Task.find({ userId: req.params.userId });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

// ✅ Update task details (Protected)
router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Error updating task" });
  }
});

// ✅ Delete a task (Protected)
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Error deleting task" });
  }
});

module.exports = router;

const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", verifyToken, async (req, res) => {
  try {
    let user = await User.findOne({ userId: req.user.uid });
    if (!user) {
      user = new User({ userId: req.user.uid, email: req.user.email });
      await user.save();
    }
    const task = new Task({ ...req.body, userId: req.user.uid });
    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Error adding task" });
  }
});

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

router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Error updating task" });
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Error deleting task" });
  }
});

module.exports = router;

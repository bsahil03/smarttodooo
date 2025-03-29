const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", verifyToken, async (req, res) => {
  try {
    // Validate request body
    const { title, priority, completed } = req.body;
    
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return res.status(400).json({ 
        error: "Title is required and must be at least 3 characters long"
      });
    }

    // Ensure user exists
    const user = await User.findOneAndUpdate(
      { userId: req.user.uid },
      { $setOnInsert: { userId: req.user.uid } },
      { upsert: true, new: true, runValidators: true }
    );

    // Create and save task
    const task = new Task({
      title: title.trim(),
      priority,
      completed: completed || false,
      userId: req.user.uid
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);

  } catch (error) {
    console.error("Detailed error:", error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: "Validation Error",
        details: errors
      });
    }
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(400).json({
        error: "Duplicate key error",
        message: "This task already exists"
      });
    }
    
    // Database connection errors
    if (error.name === 'MongoNetworkError') {
      return res.status(503).json({
        error: "Database connection error",
        message: "Please try again later"
      });
    }

    res.status(500).json({ 
      error: "Error adding task",
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Helper function to check email availability
async function isEmailAvailable(email) {
  if (!email) return false;
  const existingUser = await User.findOne({ email });
  return !existingUser;
}

router.get('/:userId', verifyToken, async (req, res) => {
  try {
    if (req.user.uid !== req.params.userId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    
    const tasks = await Task.find({ userId: req.params.userId })
      .lean() // Convert to plain JavaScript objects
      .exec();
    
    // Transform tasks to ensure id field exists
    const transformedTasks = tasks.map(task => ({
      ...task,
      id: task._id ? task._id.toString() : undefined
    }));
    
    res.json(transformedTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ 
      error: "Error fetching tasks",
      details: error.message 
    });
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

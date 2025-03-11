const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: String,
  title: String,
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  dueDate: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);

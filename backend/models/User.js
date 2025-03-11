const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true }, // ✅ Ensure unique Firebase UID
  email: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);

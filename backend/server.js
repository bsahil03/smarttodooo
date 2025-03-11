const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");

const app = express();

// ✅ Secure CORS - Allow frontend URL
const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:3000"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ Define Routes
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

// ✅ Default Route for API Health Check
app.get("/", (req, res) => {
  res.send("🚀 Smart To-Do API is running...");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

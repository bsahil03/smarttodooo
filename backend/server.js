const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");

const app = express();

// ✅ Allow Frontend (Local & Deployed)
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000", // Local frontend
  "https://smarttodooo.onrender.com", // Deployed frontend (Make sure this matches your actual frontend URL)
];

console.log("✅ Allowed Origins:", allowedOrigins); // Debugging

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy error: Not allowed by CORS"));
      }
    },
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

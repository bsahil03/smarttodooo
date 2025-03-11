const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");

const app = express();

// ✅ Allow Frontend URLs (Local & Firebase)
const allowedOrigins = [
  "http://localhost:3000", // Local Dev
  "https://smarttodooo.web.app", // Firebase Deployed Frontend
];

console.log("✅ Allowed Origins:", allowedOrigins); // Debugging

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("❌ CORS error: Origin not allowed -", origin);
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

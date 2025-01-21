const express = require("express");
const cors = require("cors");
const authRoutes = require("./auth/routes/authRoutes");
const userRoutes = require("./user/routes/userRoutes");
const announcementRoutes = require("./announcement/routes/announcementRoutes");
const scheduleRoutes = require("./schedule/routes/scheduleRoutes");
const connectDB = require("./config/database");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/schedule", scheduleRoutes);

// Database connection
connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./auth/routes/authRoutes");
const userRoutes = require("./user/routes/userRoutes");
const connectDB = require("./config/database");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Database connection
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

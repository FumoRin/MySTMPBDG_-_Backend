const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const JWT_SECRET = "your-secret-key"; // need to use env var with generated jwt secret

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Find user
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password (in production, use bcrypt.compare)
      if (password !== user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate token
      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          username: user.username,
          role: user.role,
          profile: user.profile,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Add a debug endpoint to check user existence
  debug: async (req, res) => {
    try {
      const { username } = req.query;
      const user = await User.findOne({ username });

      if (!user) {
        return res.json({ exists: false, message: "User not found" });
      }

      return res.json({
        exists: true,
        user: {
          username: user.username,
          role: user.role,
          hasPassword: !!user.password,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = authController;

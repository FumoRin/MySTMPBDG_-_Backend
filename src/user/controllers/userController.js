const userService = require("../services/userService");
const User = require("../../models/Users");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching users", error: error.message });
    }
  },
  register: async (req, res) => {
    try {
      const { username, password, email, role, profile } = req.body;
      const { full_name } = profile;

      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create new user using userService
      const newUser = await userService.createUser({
        username,
        password, // Note: In production, this should be hashed
        email,
        role,
        profile: {
          full_name,
        },
      });

      res.status(201).json({
        message: "User registered successfully",
        user: {
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          profile: {
            full_name: newUser.profile.full_name,
          },
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Add other user CRUD operations here
};

module.exports = userController;

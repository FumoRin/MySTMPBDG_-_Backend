const mongoose = require("mongoose");
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
      const {
        username,
        password,
        email,
        role,
        profile,
        student_info,
        teacher_info,
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Prepare user data based on role
      const userData = {
        username,
        password,
        email,
        role,
        profile: {
          full_name: profile.full_name,
        },
      };

      // Add role-specific information
      if (role === "student") {
        userData.student_info = student_info;
      } else if (role === "teacher") {
        userData.teacher_info = teacher_info;
      }

      // Create new user
      const newUser = await User.create(userData);

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
      res.status(500).json({
        message: "Server error",
        error: error.message,
        details: error.errors, // This can help debug validation errors
      });
    }
  },

  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const { username, email, role, profile } = req.body;
      const { full_name } = profile;

      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user details
      user.username = username || user.username;
      user.email = email || user.email;
      user.role = role || user.role;
      user.profile.full_name = full_name || user.profile.full_name;

      // Save the updated user
      const updatedUser = await user.save();

      res.json({
        message: "User updated successfully",
        user: {
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          profile: {
            full_name: updatedUser.profile.full_name,
          },
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const currentUser = req.user;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
      }

      const user = await userService.findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (currentUser.role !== "sysadmin") {
        return res.status(403).json({
          message: "You are not authorized to delete this announcement",
        });
      }

      const deletedUser = await userService.deleteUser(user);

      res.status(200).json({
        message: "User deleted successfully",
        deletedUser: {
          username: deletedUser.username,
          email: deletedUser.email,
          role: deletedUser.role,
          profile: {
            full_name: deletedUser.profile.full_name,
          },
        },
      });
    } catch (error) {
      console.error("Delete announcement error:", error);
      res.status(500).json({
        message: "Error deleting announcement",
        error: error.message,
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
      }

      const user = await userService.findUserById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Get User by ID error:", error);
      res
        .status(500)
        .json({ message: "Error fetching user", error: error.message });
    }
  },
};

module.exports = userController;

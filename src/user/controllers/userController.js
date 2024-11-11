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
      const { full_name } = profile;

      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Prepare user data based on role
      const userData = {
        username,
        password, // Note: In production, this should be hashed
        email,
        role,
        profile: {
          full_name,
          phone: profile.phone || "",
          address: profile.address || "",
          photo_url: profile.photo_url || "",
        },
      };

      // Add role-specific information
      if (role === "student") {
        userData.student_info = student_info || {
          department: "",
          generation: null,
          class: "",
        };
        userData.teacher_info = {}; // Explicitly set to empty for students
      } else if (role === "teacher") {
        userData.teacher_info = teacher_info || {
          department: "",
          subjects: [],
        };
        userData.student_info = {}; // Explicitly set to empty for teachers
      } else if (role === "sysadmin") {
        // For sysadmin, we'll leave both student_info and teacher_info empty
        userData.student_info = {};
        userData.teacher_info = {};
      }

      // Create new user using userService
      const newUser = await userService.createUser(userData);

      // Prepare response, omitting sensitive information
      const responseUser = {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile,
        ...(role === "student" && { student_info: newUser.student_info }),
        ...(role === "teacher" && { teacher_info: newUser.teacher_info }),
      };

      res.status(201).json({
        message: "User registered successfully",
        user: responseUser,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const { username, email, role, profile, student_info, teacher_info } =
        req.body;

      // Validate user ID
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }

      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Authorization check
      const currentUser = req.user;
      if (
        currentUser.role !== "sysadmin" &&
        currentUser._id.toString() !== userId
      ) {
        return res
          .status(403)
          .json({ message: "You are not authorized to update this user" });
      }

      // Update basic user details
      user.username = username || user.username;
      user.email = email || user.email;
      user.role = role || user.role;

      // Update profile
      if (profile) {
        user.profile.full_name = profile.full_name || user.profile.full_name;
        user.profile.phone = profile.phone || user.profile.phone || "";
        user.profile.address = profile.address || user.profile.address || "";
        user.profile.photo_url =
          profile.photo_url || user.profile.photo_url || "";
      }

      // Update role-specific information based on user role
      if (user.role === "student") {
        // Update student info
        if (student_info) {
          user.student_info.department =
            student_info.department || user.student_info.department;
          user.student_info.generation =
            student_info.generation || user.student_info.generation;
          user.student_info.class =
            student_info.class || user.student_info.class;
        }
        user.teacher_info = {};
      } else if (user.role === "teacher") {
        // Update teacher info
        if (teacher_info) {
          user.teacher_info.department =
            teacher_info.department || user.teacher_info.department;
          user.teacher_info.subjects =
            teacher_info.subjects || user.teacher_info.subjects;
        }
        user.student_info = {};
      } else if (user.role === "sysadmin") {
        // For sysadmin, keep both student_info and teacher_info empty
        user.student_info = {};
        user.teacher_info = {};
      }

      // Save the updated user
      const updatedUser = await user.save();

      // Prepare response
      const responseUser = {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        profile: updatedUser.profile,
        ...(updatedUser.role === "student" && {
          student_info: updatedUser.student_info,
        }),
        ...(updatedUser.role === "teacher" && {
          teacher_info: updatedUser.teacher_info,
        }),
      };

      res.json({
        message: "User updated successfully",
        user: responseUser,
      });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const currentUser = req.user; // Assuming you have authentication middleware

      // Validate if the userId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Authorization checks: Only allow admin deletion
      if (currentUser.role !== "sysadmin") {
        return res.status(403).json({
          message: "You are not authorized to delete this user",
        });
      }

      // Prevent deletion of system admin users
      if (user.role === "sysadmin") {
        return res.status(403).json({
          message: "Cannot delete system admin user",
        });
      }

      // Hard delete
      const deletedUser = await User.findByIdAndDelete(userId);

      // Prepare response
      res.status(200).json({
        message: "User deleted successfully",
        deletedUser: {
          id: deletedUser._id,
          username: deletedUser.username,
          email: deletedUser.email,
          role: deletedUser.role,
        },
      });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({
        message: "Error deleting user",
        error: error.message,
      });
    }
  },
};

module.exports = userController;

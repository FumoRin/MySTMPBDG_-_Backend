const jwt = require("jsonwebtoken");
const User = require("../../models/Users");
const { JWT_SECRET } = require("../../config/jwt");

const authService = {
  login: async (username, password) => {
    const user = await User.findOne({ username });
    if (!user || password !== user.password) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      message: "Login successful",
      token,
      user: {
        username: user.username,
        role: user.role,
        profile: user.profile,
      },
    };
  },

  debug: async (username) => {
    const user = await User.findOne({ username });
    if (!user) {
      return { exists: false, message: "User not found" };
    }
    return {
      exists: true,
      user: {
        username: user.username,
        role: user.role,
        hasPassword: !!user.password,
      },
    };
  },
};

module.exports = authService;

const User = require("../../models/Users");

const userService = {
  getAllUsers: async () => {
    return User.find({}, "-password");
  },

  findUserById: async (userId) => {
    return User.findById(userId);
  },

  createUser: async (userData) => {
    const newUser = new User(userData);
    return await newUser.save();
  },

  updateUser: async (userId, userData) => {
    return await User.findByIdAndUpdate(userId, userData, {
      new: true,
      runValidators: true,
    });
  },

  deleteUser: async (userId) => {
    return await User.findByIdAndDelete(userId);
  },
};

module.exports = userService;

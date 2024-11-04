const User = require("../../models/Users");

const userService = {
  getAllUsers: async () => {
    return User.find({}, "-password");
  },

  createUser: async (userData) => {
    const newUser = new User(userData);
    return await newUser.save();
  },
  // Add other user CRUD operations here
};

module.exports = userService;

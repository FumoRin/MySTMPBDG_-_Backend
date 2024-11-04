const authService = require("../services/authService");

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: "Invalid credentials" });
    }
  },

  debug: async (req, res) => {
    try {
      const { username } = req.query;
      const result = await authService.debug(username);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = authController;

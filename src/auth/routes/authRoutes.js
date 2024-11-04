const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

router.post("/login", authController.login);
router.get("/debug", authController.debug); // Add debug endpoint
// Protected route example
router.get("/profile", authMiddleware.verifyToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;

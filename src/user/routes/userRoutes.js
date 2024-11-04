const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../../auth/middleware/auth");

router.get("/", authMiddleware.verifyToken, userController.getAllUsers);
router.post("/register", authMiddleware.verifyToken, userController.register);

module.exports = router;

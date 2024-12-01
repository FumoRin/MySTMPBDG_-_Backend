const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../../auth/middleware/auth");

router.get("/", authMiddleware.verifyToken, userController.getAllUsers);
router.get("/:id", authMiddleware.verifyToken, userController.getUserById);
router.post("/register", authMiddleware.verifyToken, userController.register);
router.patch("/:id", authMiddleware.verifyToken, userController.updateUser);
router.delete("/:id", authMiddleware.verifyToken, userController.deleteUser);

module.exports = router;

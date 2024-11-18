const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcementController");
const authMiddleware = require("../../auth/middleware/auth");

router.get(
  "/",
  authMiddleware.verifyToken,
  announcementController.getAllAnnouncements
);
router.get(
  "/:id",
  authMiddleware.verifyToken,
  announcementController.getAnnouncementById
);
router.post(
  "/",
  authMiddleware.verifyToken,
  announcementController.createAnnouncement
);
router.patch(
  "/:id",
  authMiddleware.verifyToken,
  announcementController.updateAnnouncement
);
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  announcementController.deleteAnnouncement
);

module.exports = router;

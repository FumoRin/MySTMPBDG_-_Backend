const express = require("express");
const router = express.Router();
const scheduleController = require("../controller/scheduleController");
const authMiddleware = require("../../auth/middleware/auth");

router.get("/", authMiddleware.verifyToken, scheduleController.getAllSchedules);

router.get(
  "/:id",
  authMiddleware.verifyToken,
  scheduleController.getScheduleById
);

router.post("/", authMiddleware.verifyToken, scheduleController.createSchedule);

router.patch(
  "/:id",
  authMiddleware.verifyToken,
  scheduleController.updateSchedule
);

router.delete(
  "/:id",
  authMiddleware.verifyToken,
  scheduleController.deleteSchedule
);

module.exports = router;

const mongoose = require("mongoose");
const scheduleService = require("../services/scheduleService");
const schedule = require("../../models/schedule");

const scheduleController = {
  getAllSchedules: async (req, res) => {
    try {
      const schedules = await scheduleService.getAllSchedule();
      res.status(200).json(schedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getScheduleById: async (req, res) => {
    try {
      const scheduleId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
        return res.status(400).json({ message: "Invalid schedule ID format" });
      }
      const schedule = await scheduleService.getScheduleById(scheduleId);
      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.status(200).json(schedule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createSchedule: async (req, res) => {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const {
        class_name,
        subject,
        teacher,
        day_of_week,
        time_slot,
        room,
        session_type,
        semester,
        academic_year,
      } = req.body;

      const scheduleData = {
        class_name,
        subject,
        teacher,
        day_of_week: day_of_week || "Monday",
        time_slot: time_slot || { start_time: "08:00", end_time: "09:30" },
        room,
        session_type: session_type || "general",
        semester: semester || "1",
        academic_year,
      };

      const newSchedule = await scheduleService.createSchedule(scheduleData);
      res.status(201).json({
        message: "Schedule created successfully",
        schedule: newSchedule,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error creating schedule",
        error: error.message,
      });
    }
  },

  // This function needs to add authorization for admin
  updateSchedule: async (req, res) => {
    try {
      const scheduleId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
        return res.status(400).json({ message: "Invalid schedule ID format" });
      }

      const existingSchedule = await scheduleService.getScheduleById(
        scheduleId
      );
      if (!existingSchedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }

      // const currentUser = req.user;
      // if (currentUser.role !== "admin") {
      //   return res
      //     .status(403)
      //     .json({ message: "You are not authorized to update this schedule" });
      // }

      const updatedSchedule = await scheduleService.updateSchedule(
        scheduleId,
        req.body
      );
      res.status(200).json({
        message: "Schedule updated successfully",
        schedule: updatedSchedule,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error updating schedule",
        error: error.message,
      });
    }
  },

  // This function needs to add authorization for admin too
  deleteSchedule: async (req, res) => {
    try {
      const scheduleId = req.params.id;
      // const currentUser = req.user;

      if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
        return res.status(400).json({ message: "Invalid schedule ID format" });
      }

      const existingSchedule = await scheduleService.getScheduleById(
        scheduleId
      );
      if (!existingSchedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }

      // if (currentUser.role !== "admin") {
      //   return res
      //     .status(403)
      //     .json({ message: "You are not authorized to delete this schedule" });
      // }

      const deleteSchedule = await scheduleService.deleteSchedule(scheduleId);

      res.status(200).json({
        message: "Schedule deleted successfully",
        deleteSchedule: {
          _id: deleteSchedule._id,
          subject: deleteSchedule.subject,
          teacher: deleteSchedule.teacher,
          class_name: deleteSchedule.class_name,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error deleting schedule",
        error: error.message,
      });
    }
  },
};

module.exports = scheduleController;

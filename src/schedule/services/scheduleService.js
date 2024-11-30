const schedule = require("../../models/schedule");

const scheduleService = {
  getAllSchedule: async () => {
    return await schedule.find();
  },

  getScheduleById: async (scheduleId) => {
    return await schedule.findById(scheduleId);
  },

  createSchedule: async (scheduleData) => {
    const newSchedule = new schedule(scheduleData);
    return await newSchedule.save();
  },

  updateSchedule: async (scheduleId, scheduleData) => {
    return await schedule.findByIdAndUpdate(scheduleId, scheduleData, {
      new: true,
      runValidators: true,
    });
  },

  deleteSchedule: async (scheduleId) => {
    return await schedule.findByIdAndDelete(scheduleId);
  },
};

module.exports = scheduleService;

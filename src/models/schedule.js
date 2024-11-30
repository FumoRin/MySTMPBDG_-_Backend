const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    class_name: { type: String, required: true },
    subject: { type: String, required: true },
    teacher: { type: String, required: true },
    day_of_week: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      required: true,
    },
    time_slot: {
      start_time: { type: String, required: true },
      end_time: { type: String, required: true },
    },
    room: { type: String, required: true },
    session_type: {
      type: String,
      enum: ["general", "vocational", "P5"],
      required: true,
    },
    semester: { type: String, enum: ["1", "2"], required: true },
    academic_year: { type: String, required: true },
  },
  { collection: "jadwal" }
);

module.exports = mongoose.model("Schedule", scheduleSchema);

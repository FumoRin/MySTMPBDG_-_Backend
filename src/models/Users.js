const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    role: {
      type: String,
      enum: ["sysadmin", "teacher", "student"],
      required: true,
    },
    profile: {
      full_name: { type: String, required: true },
      phone: String,
      address: String,
      photo_url: String,
    },
    student_info: {
      type: {
        department: { type: String },
        generation: {
          type: Number,
        },
        class: { type: String },
      },
      required: function () {
        return this.role === "student";
      },
    },
    teacher_info: {
      type: {
        department: { type: String },
        subjects: {
          type: [String],
        },
      },
      required: function () {
        return this.role === "teacher";
      },
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "users" }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

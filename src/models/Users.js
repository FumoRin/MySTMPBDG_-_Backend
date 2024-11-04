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
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "users" }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

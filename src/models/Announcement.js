// announcementModel.js
const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String },
});

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    target_audience: {
      type: [String],
      enum: ["all", "teachers", "students", "department"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
    },
    category: {
      type: String,
      enum: ["academic", "meeting", "event", "competition", "general"],
    },
    location: { type: String },
    publish_date: { type: Date },
    announcement_date: { type: Date },
    attachments: [attachmentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);

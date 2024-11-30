const mongoose = require("mongoose");
const announcementService = require("../services/announcementService");
const Announcement = require("../../models/Announcement");

const announcementController = {
  getAllAnnouncements: async (req, res) => {
    try {
      const announcements = await announcementService.getAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching announcements",
        error: error.message,
      });
    }
  },

  createAnnouncement: async (req, res) => {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          message: "User not authenticated",
        });
      }
      // Ensure the logged-in user is the author
      req.body.author_id = req.user.userId;

      const {
        title,
        content,
        target_audience,
        priority,
        category,
        location,
        publish_date,
        announcement_date,
        attachments,
      } = req.body;

      // Validate required fields
      if (!title || !content || !target_audience) {
        return res.status(400).json({
          message: "Title, content, and target audience are required",
        });
      }

      const announcementData = {
        title,
        content,
        author_id: req.user.userId,
        target_audience,
        priority: priority || "low",
        category: category || "general",
        location: location || "",
        publish_date: publish_date || new Date(),
        announcement_date: announcement_date,
        attachments: attachments || [],
      };

      const newAnnouncement = await announcementService.createAnnouncement(
        announcementData
      );

      res.status(201).json({
        message: "Announcement created successfully",
        announcement: newAnnouncement,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error creating announcement",
        error: error.message,
      });
    }
  },

  updateAnnouncement: async (req, res) => {
    try {
      const announcementId = req.params.id;

      // Validate announcement ID
      if (!mongoose.Types.ObjectId.isValid(announcementId)) {
        return res
          .status(400)
          .json({ message: "Invalid announcement ID format" });
      }

      // Find the announcement
      const existingAnnouncement = await Announcement.findById(announcementId);
      if (!existingAnnouncement) {
        return res.status(404).json({ message: "Announcement not found" });
      }

      // Authorization check
      const currentUser = req.user;
      if (
        currentUser.role !== "sysadmin" &&
        existingAnnouncement.author_id.toString() !== currentUser._id.toString()
      ) {
        return res.status(403).json({
          message: "You are not authorized to update this announcement",
        });
      }

      // Update announcement
      const updatedAnnouncement = await announcementService.updateAnnouncement(
        announcementId,
        req.body
      );

      res.json({
        message: "Announcement updated successfully",
        announcement: updatedAnnouncement,
      });
    } catch (error) {
      console.error("Update announcement error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  deleteAnnouncement: async (req, res) => {
    try {
      const announcementId = req.params.id;
      const currentUser = req.user;

      // Validate announcement ID
      if (!mongoose.Types.ObjectId.isValid(announcementId)) {
        return res
          .status(400)
          .json({ message: "Invalid announcement ID format" });
      }

      // Find the announcement
      const announcement = await Announcement.findById(announcementId);
      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }

      // Authorization check
      if (
        currentUser.role !== "sysadmin" &&
        announcement.author_id.toString() !== currentUser._id.toString()
      ) {
        return res.status(403).json({
          message: "You are not authorized to delete this announcement",
        });
      }

      // Delete announcement
      const deletedAnnouncement = await announcementService.deleteAnnouncement(
        announcementId
      );

      res.status(200).json({
        message: "Announcement deleted successfully",
        deletedAnnouncement: {
          id: deletedAnnouncement._id,
          title: deletedAnnouncement.title,
        },
      });
    } catch (error) {
      console.error("Delete announcement error:", error);
      res.status(500).json({
        message: "Error deleting announcement",
        error: error.message,
      });
    }
  },

  getAnnouncementById: async (req, res) => {
    try {
      const announcementId = req.params.id;

      // Validate announcement ID
      if (!mongoose.Types.ObjectId.isValid(announcementId)) {
        return res
          .status(400)
          .json({ message: "Invalid announcement ID format" });
      }

      const announcement = await announcementService.getAnnouncementById(
        announcementId
      );

      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }

      res.json(announcement);
    } catch (error) {
      console.error("Get announcement by ID error:", error);
      res
        .status(500)
        .json({ message: "Error fetching announcement", error: error.message });
    }
  },
};

module.exports = announcementController;

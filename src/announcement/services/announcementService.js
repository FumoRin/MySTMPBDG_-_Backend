const Announcement = require("../../models/Announcement");

const announcementService = {
  getAllAnnouncements: async () => {
    return Announcement.find().populate("author_id", "username profile");
  },

  createAnnouncement: async (announcementData) => {
    const newAnnouncement = new Announcement(announcementData);
    return await newAnnouncement.save();
  },

  updateAnnouncement: async (announcementId, announcementData) => {
    return await Announcement.findByIdAndUpdate(
      announcementId,
      announcementData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("author_id", "username profile");
  },

  deleteAnnouncement: async (announcementId) => {
    return await Announcement.findByIdAndDelete(announcementId);
  },

  getAnnouncementById: async (announcementId) => {
    return Announcement.findById(announcementId).populate(
      "author_id",
      "username profile"
    );
  },
};

module.exports = announcementService;

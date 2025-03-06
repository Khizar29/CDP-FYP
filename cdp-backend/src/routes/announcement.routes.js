const express = require("express");
const {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementsById
} = require("../controllers/announcement.controller.js");
const { verifyJWT, verifyRole } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.get("/", verifyJWT, getAnnouncements);
router.get("/:announcementId", verifyJWT, getAnnouncementsById);

// Protected routes (Admin & Faculty)
router.post("/", verifyJWT, verifyRole(["admin", "faculty"]), createAnnouncement);
router.put("/:announcementId", verifyJWT, verifyRole(["admin", "faculty"]), updateAnnouncement);

// Admin-only route
router.delete("/:announcementId", verifyJWT, verifyRole(["admin", "faculty"]), deleteAnnouncement);

module.exports = router;

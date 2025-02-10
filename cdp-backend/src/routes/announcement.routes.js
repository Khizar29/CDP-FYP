import express from "express";
import {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public route
router.get("/", getAnnouncements);

// Protected routes (Admin & Faculty)
router.post("/", verifyJWT, verifyRole(["admin", "faculty"]), createAnnouncement);
router.put("/:announcementId", verifyJWT, verifyRole(["admin", "faculty"]), updateAnnouncement);

// Admin-only route
router.delete("/:announcementId", verifyJWT, verifyRole(["admin"]), deleteAnnouncement);

export default router;

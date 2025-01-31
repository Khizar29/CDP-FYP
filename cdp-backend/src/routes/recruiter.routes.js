import express from "express";
import {
  registerRecruiter,
  getAllRecruiters,
  getPendingRecruiters,
  verifyRecruiter,
  unverifyRecruiter,
  deleteRecruiter,
  updateRecruiter
} from "../controllers/recruiter.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerRecruiter);
router.get("/", verifyJWT, verifyAdmin, getAllRecruiters);
router.get("/pending", verifyJWT, verifyAdmin, getPendingRecruiters);
router.put("/verify/:recruiterId", verifyJWT, verifyAdmin, verifyRecruiter);
router.put("/unverify/:recruiterId", verifyJWT, verifyAdmin, unverifyRecruiter);
router.delete("/:recruiterId", verifyJWT, verifyAdmin, deleteRecruiter);
router.put("/:recruiterId", verifyJWT, verifyAdmin, updateRecruiter);

export default router;

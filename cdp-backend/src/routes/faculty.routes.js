import express from "express";
import {
  registerFaculty,
  getAllFaculty,
  getPendingFaculty,
  verifyFaculty,
  unverifyFaculty,
  deleteFaculty,
  //updateFaculty
} from "../controllers/faculty.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerFaculty);
router.get("/", verifyJWT, verifyAdmin, getAllFaculty);
router.get("/pending", verifyJWT, verifyAdmin, getPendingFaculty);
router.put("/verify/:facultyId", verifyJWT, verifyAdmin, verifyFaculty);
router.put("/unverify/:facultyId", verifyJWT, verifyAdmin, unverifyFaculty);
router.delete("/:facultyId", verifyJWT, verifyAdmin, deleteFaculty);
// router.put("/:facultyId", verifyJWT, verifyAdmin, updateFaculty);

export default router;

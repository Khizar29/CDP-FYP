const express = require("express");
const {
  registerRecruiter,
  getAllRecruiters,
  getPendingRecruiters,
  verifyRecruiter,
  unverifyRecruiter,
  deleteRecruiter,
  updateRecruiter
} = require("../controllers/recruiter.controller.js");
const { verifyJWT, verifyAdmin } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/register", registerRecruiter);
router.get("/", verifyJWT, verifyAdmin, getAllRecruiters);
router.get("/pending", verifyJWT, verifyAdmin, getPendingRecruiters);
router.put("/verify/:recruiterId", verifyJWT, verifyAdmin, verifyRecruiter);
router.put("/unverify/:recruiterId", verifyJWT, verifyAdmin, unverifyRecruiter);
router.delete("/:recruiterId", verifyJWT, verifyAdmin, deleteRecruiter);
router.put("/:recruiterId", verifyJWT, verifyAdmin, updateRecruiter);

module.exports = router;

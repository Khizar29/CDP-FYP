const express = require("express");
const { verifyJWT, verifyAdmin } = require("../middlewares/auth.middleware");
const {
  trackApplication,
  // getTrendingJobNiches,
  getMostSoughtJobs,
  getMonthlyApplications,
  getJobApplicationCount,
  getAllJobsApplicationCount,
} = require("../controllers/jobapplication.controller");

const router = express.Router();

// Track job applications
router.post("/track", verifyJWT, trackApplication);

// Admin Analytics
// router.get("/trending-niches", verifyJWT, verifyAdmin, getTrendingJobNiches);
router.get("/most-sought", verifyJWT, verifyAdmin, getMostSoughtJobs);
router.get("/monthly-breakdown", verifyJWT, verifyAdmin, getMonthlyApplications);


module.exports = router;

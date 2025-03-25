const express = require("express");
const { verifyJWT, verifyAdmin } = require("../middlewares/auth.middleware");
const {
  trackApplication,
  // getTrendingJobNiches,
  getMostSoughtJobs,
  getMonthlyApplications,
  getJobApplicationCount,
  getAllJobsApplicationCount,
  getApplicationsPerJobType,
  getJobPostingsByQualification,
  getJobPostingsVsApplicationsOverTime,
  getAllJobsApplicationPerCompany,
} = require("../controllers/jobapplication.controller");

const router = express.Router();

// Track job applications
router.post("/track", verifyJWT, trackApplication);

module.exports = router;

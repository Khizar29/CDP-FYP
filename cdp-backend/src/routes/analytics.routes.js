const express = require("express");
const { verifyJWT, verifyAdmin } = require("../middlewares/auth.middleware");
const {

  getMostSoughtJobs,
  getMonthlyApplications,
  getApplicationsPerJobType,
  getJobApplicationsCount,
  getJobPostingsByQualification,
  getJobPostingsVsApplicationsOverTime,
  getAllJobsApplicationPerCompany,
  getJobsPostedPerMonth,
  getJobPostingsByRecruiter,
  getSortedJobsByApplicationCount,
} = require("../controllers/analytics.controller");

const router = express.Router();

// Admin Analytics
// router.get("/trending-niches", verifyJWT, verifyAdmin, getTrendingJobNiches);
router.get("/most-sought-jobs", verifyJWT, verifyAdmin, getMostSoughtJobs);
router.get("/applications-per-month", verifyJWT, verifyAdmin, getMonthlyApplications);
router.get("/applications-per-job", verifyJWT, verifyAdmin, getJobApplicationsCount);
router.get("/applications-per-job-type", verifyJWT, verifyAdmin, getApplicationsPerJobType);
router.get("/job-postings-by-qualification", verifyJWT, verifyAdmin, getJobPostingsByQualification);
router.get("/job-postings-vs-applications-over-time", verifyJWT, verifyAdmin, getJobPostingsVsApplicationsOverTime);
router.get("/applications-per-company", verifyJWT, verifyAdmin, getAllJobsApplicationPerCompany);
router.get("/job-postings-per-month", verifyJWT, verifyAdmin, getJobsPostedPerMonth);
router.get("/job-postings-by-recruiter", verifyJWT, verifyAdmin, getJobPostingsByRecruiter);
router.get("/jobs-by-applications", verifyJWT, verifyAdmin, getSortedJobsByApplicationCount);

module.exports = router;

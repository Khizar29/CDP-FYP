const express = require("express");
const axios = require("axios");
const { Groq } = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getJobCount,
  getRecruiterJobs,
  approveJob,
  extractJobInfofromText,
  extractJobInfoFromImageWithGroq,

} = require("../controllers/job.controller.js");
const { verifyJWT, verifyAdmin, verifyRole } = require("../middlewares/auth.middleware.js");
const { upload } = require("../middlewares/multer.middleware.js");
const router = express.Router();

router.use(verifyJWT);

// Routes accessible to all authenticated users
router.get('/count', getJobCount);
router.get('/', getAllJobs);
router.post('/', verifyRole(['admin', 'recruiter']), createJob);

router.get('/recruiter', verifyRole(['recruiter']), getRecruiterJobs);
router.post('/extract-from-image', upload.single('job_ad_file'), extractJobInfoFromImageWithGroq);
router.post('/extract', verifyAdmin, extractJobInfofromText);

router.use(verifyAdmin);

router.patch("/:jobId/approve", approveJob);
router.route('/:jobId').get(getJobById).put(updateJob).delete(deleteJob);


module.exports = router;

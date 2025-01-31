import { Router } from 'express';
import axios from 'axios';
import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getJobCount,
} from '../controllers/job.controller.js';
import { verifyJWT, verifyAdmin, verifyRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply JWT verification for all routes
router.use(verifyJWT);

// Routes accessible to all authenticated users
router.get('/count', getJobCount);
router.route('/').get(getAllJobs);
router.route('/:jobId').get(getJobById);

// Extract job information (Authenticated users only)
router.post('/extract', async (req, res) => {
  try {
    const { job_ad_text } = req.body;
    const response = await axios.post('http://127.0.0.1:5001/extract', { job_ad_text });
    res.json(response.data);
  } catch (error) {
    console.error('Error extracting job info:', error);
    res.status(500).json({ message: 'Error extracting job info' });
  }
});

// Allow only admin and recruiter roles to post jobs
router.route('/').post(verifyRole(['admin', 'recruiter']), createJob);

// Admin-only routes for updating and deleting jobs
router.use(verifyAdmin);
router.route('/:jobId').put(updateJob).delete(deleteJob);

export default router;

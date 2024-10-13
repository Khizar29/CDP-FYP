import { Router } from 'express';
import axios from 'axios';
import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getJobCount
} from '../controllers/job.controller.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/count', getJobCount);
router.route('/').get(getAllJobs);
router.route('/:jobId').get(getJobById);

// Route to extract job information using Python service
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

// Admin routes
router.use(verifyJWT);
router.use(verifyAdmin);

router.route('/').post(createJob);
router.route('/:jobId').put(updateJob).delete(deleteJob);

export default router;

import { Router } from 'express';
import axios from 'axios';
import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getJobCount,
  getRecruiterJobs,
  approveJob,
} from '../controllers/job.controller.js';
import { verifyJWT, verifyAdmin, verifyRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

// Routes accessible to all authenticated users
router.get('/count', getJobCount);
router.get('/', getAllJobs); 
router.post('/', verifyRole(['admin', 'recruiter']), createJob); 


router.get('/recruiter', verifyRole(['recruiter']), getRecruiterJobs);

//  Job extraction route (not role-protected)
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


router.use(verifyAdmin); 
router.patch("/:jobId/approve", approveJob);
router.route('/:jobId').get(getJobById).put(updateJob).delete(deleteJob);

export default router;

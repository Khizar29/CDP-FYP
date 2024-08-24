import { Router } from 'express';
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

// Admin routes
router.use(verifyJWT); // Ensure user is logged in
router.use(verifyAdmin); // Ensure user is admin

router.route('/').post(createJob);
router.route('/:jobId').put(updateJob).delete(deleteJob);

export default router;

// src/routes/job.routes.js
import { Router } from 'express';
import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById,
} from '../controllers/job.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.route('/').get(getAllJobs);
router.route('/:jobId').get(getJobById);

// Admin routes
router.use(verifyJWT); // Ensure user is logged in
router.route('/').post(createJob);
router.route('/:jobId').put(updateJob).delete(deleteJob);

export default router;

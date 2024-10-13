import { Router } from 'express';
import {
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getTestimonialById,
    fetchTestimonials
} from '../controllers/testimonial.controller.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes 
router.route('/').get(fetchTestimonials);
router.route('/:testimonialId').get(getTestimonialById);

// Admin routes
router.use(verifyJWT); // Ensure user is logged in
router.use(verifyAdmin); // Ensure user is admin

router.route('/').post(createTestimonial);
router.route('/:testimonialId').put(updateTestimonial).delete(deleteTestimonial);

export default router;

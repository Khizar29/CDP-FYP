const express = require("express");
const {
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getTestimonialById,
    fetchTestimonials
} = require("../controllers/testimonial.controller.js");
const { verifyJWT, verifyAdmin } = require("../middlewares/auth.middleware.js");
const { upload } = require("../middlewares/multer.middleware.js");

const router = express.Router();

// Public routes 
router.get('/', fetchTestimonials);
router.get('/:testimonialId', getTestimonialById);

// Apply JWT and Admin verification for all routes below
router.use(verifyJWT);
router.use(verifyAdmin);

// Admin routes
router.post('/', upload.single('image'), createTestimonial);
router.put('/:testimonialId', upload.single('image'), updateTestimonial);
router.delete('/:testimonialId', deleteTestimonial);

module.exports = router;

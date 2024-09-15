import { Router } from 'express';
import { importGraduates } from '../controllers/graduate.controller.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js'; // Import multer middleware for file handling

const router = Router();

// Admin routes
router.use(verifyJWT);
router.use(verifyAdmin);

// Route to import graduates from an Excel file
router.post('/import', upload.single('file'), importGraduates);

export default router;

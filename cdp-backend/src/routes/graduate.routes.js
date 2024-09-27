import { Router } from 'express';
import { 
    importGraduates, 
    updateGraduate,
    deleteGraduate,
    fetchGraduates,
    getGraduateById
} from '../controllers/graduate.controller.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js'; // Import multer middleware for file handling

const router = Router();

// Admin routes
router.use(verifyJWT);
router.use(verifyAdmin);

// Route to import graduates from an Excel file
router.post('/import', upload.single('file'), importGraduates);

// Route to update a graduate's information by nuId (Admin only)
router.put('/:nuId', updateGraduate);

// Route to delete a graduate's profile by nuId (Admin only)
router.delete('/:nuId', deleteGraduate);

// Public routes
router.get('/', fetchGraduates); // Route to fetch all graduate profiles
router.route('/:nuId').get(getGraduateById); // Route to fetch graduate by ID

export default router;

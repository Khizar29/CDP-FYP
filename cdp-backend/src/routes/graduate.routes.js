import { Router } from 'express';
import { 
    importGraduates, 
    updateGraduate,
    deleteGraduate,
    fetchGraduates,
    getGraduateById,
    getGraduateCount
} from '../controllers/graduate.controller.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js'; // Import multer middleware for file handling

const router = Router();

// Public routes
router.get('/count', getGraduateCount); // Fetch the count of graduates
router.get('/', fetchGraduates); // Fetch all graduate profiles
router.get('/:nuId', getGraduateById); // Fetch a single graduate by ID

// Admin routes
router.use(verifyJWT); // Apply JWT verification for all routes below this point
router.use(verifyAdmin); // Apply admin verification for the following routes

router.post('/import', upload.single('file'), importGraduates); // Import graduates from an Excel file
router.put('/:nuId', updateGraduate); // Update a graduate's information
router.delete('/:nuId', deleteGraduate); // Delete a graduate's profile

export default router;

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
import { upload } from '../middlewares/multer.middleware.js'; 
import { authorizeGraduate } from '../middlewares/authgraduates.middleware.js'; 

const router = Router();

// Public routes
router.get('/count', getGraduateCount); // Fetch the count of graduates
router.get('/', fetchGraduates); // Fetch all graduate profiles
router.get('/:nuId', getGraduateById); // Fetch a single graduate by ID

// Apply JWT verification for all routes below this point
router.use(verifyJWT); 

// Admin-only routes (for actions like import or delete)
router.post('/import', verifyAdmin, upload.single('file'), importGraduates); // Import graduates from an Excel file
router.delete('/:nuId', verifyAdmin, deleteGraduate); // Delete a graduate's profile

// Graduate and Admin routes for updating profile
router.put('/:nuId', authorizeGraduate, updateGraduate); // Update a graduate's information (with role-based control)

export default router;

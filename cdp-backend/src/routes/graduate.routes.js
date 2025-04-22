const express = require("express");
const {
    importGraduates, 
    updateGraduate,
    deleteGraduate,
    fetchGraduates,
    getGraduateById,
    getGraduateCount,
    getGraduateNeighbors
} = require("../controllers/graduate.controller.js");
const { verifyJWT, verifyAdmin } = require("../middlewares/auth.middleware.js");
const { upload } = require("../middlewares/multer.middleware.js"); 
const { authorizeGraduate } = require("../middlewares/authgraduates.middleware.js"); 

const router = express.Router();

// Public routes
router.get('/:nuId/neighbors', getGraduateNeighbors);
router.get('/count', getGraduateCount); // Fetch the count of graduates
router.get('/', fetchGraduates); // Fetch all graduate profiles
router.get('/:nuId', getGraduateById); // Fetch a single graduate by ID

// Apply JWT verification for all routes below this point
router.use(verifyJWT); 

// Admin-only routes (for actions like import or delete)
router.post('/import', verifyAdmin, upload.single('file'), importGraduates); // Import graduates from an Excel file
router.delete('/:nuId', verifyAdmin, deleteGraduate); // Delete a graduate's profile

// Graduate and Admin routes for updating profile
router.put(
    '/:nuId', 
    upload.single('profilePic'), // Handle file uploads for profile pictures
    authorizeGraduate,           // Check if the user is authorized to update the profile
    updateGraduate               // Update graduate information
);

module.exports = router;

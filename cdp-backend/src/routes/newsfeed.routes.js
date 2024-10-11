import { Router } from 'express';
import { createNewsFeed, fetchNewsFeeds, fetchNewsFeedById, updateNewsFeed, deleteNewsFeed } from '../controllers/newsfeed.controller.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// Public route to fetch news and events
router.get('/', fetchNewsFeeds); // Fetch public news and events
router.get('/:id', fetchNewsFeedById); // Fetch a single news feed by ID

// Apply JWT verification for all routes below this point
router.use(verifyJWT);

// Admin-only routes
router.post('/', verifyAdmin, upload.single('image'), createNewsFeed); // Create a news or event
router.put('/:id', verifyAdmin, upload.single('image'), updateNewsFeed); // Update a news or event
router.delete('/:id', verifyAdmin, deleteNewsFeed); // Delete a news or event

export default router;

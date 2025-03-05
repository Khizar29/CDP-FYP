const express = require("express");
const {
  createNewsFeed,
  fetchNewsFeeds,
  fetchNewsFeedById,
  updateNewsFeed,
  deleteNewsFeed
} = require("../controllers/newsfeed.controller.js");
const { verifyJWT, verifyRole } = require("../middlewares/auth.middleware.js");
const { upload } = require("../middlewares/multer.middleware.js");

const router = express.Router();

// Public route to fetch news and events
router.get('/', verifyJWT.optional, fetchNewsFeeds); // Fetch public news and events
router.get('/:id', fetchNewsFeedById); // Fetch a single news feed by ID

// Apply JWT verification for all routes below this point
router.use(verifyJWT);

// Admin & Faculty routes
router.post('/', verifyRole(["admin", "faculty"]), upload.single('image'), createNewsFeed); // Create a news or event
router.put('/:id', verifyRole(["admin", "faculty"]), upload.single('image'), updateNewsFeed); // Update a news or event
router.delete('/:id', verifyRole(["admin", "faculty"]), deleteNewsFeed); // Delete a news or event

module.exports = router;

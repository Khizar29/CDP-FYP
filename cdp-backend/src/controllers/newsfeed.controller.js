import NewsFeed from '../models/newsfeed.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import path from 'path';


// Create a new news or event
const createNewsFeed = asyncHandler(async (req, res) => {
  if (!req.user || !['admin', 'faculty'].includes(req.user.role)) {
    throw new ApiError(403, "Forbidden: Admins and Faculty only");
  }

  const { title, description, category, isPublic  } = req.body;
  const imagePath = req.savedImagePath || '';

  const imageUrl = `${req.protocol}://${req.get('host')}/temp/${path.basename(imagePath)}`;
  const newsFeed = new NewsFeed({ 
      title, 
      description, 
      image: imageUrl, 
      category: category || 'news',
      isPublic: isPublic !== undefined ? isPublic : true,
      postedBy: req.user._id,
  });

  await newsFeed.save();
  res.status(201).json(new ApiResponse(201, newsFeed, 'NewsFeed created successfully'));
});

// Update a news or event
const updateNewsFeed = asyncHandler(async (req, res) => {
  if (!req.user || !['admin', 'faculty'].includes(req.user.role)) {
    throw new ApiError(403, "Forbidden: Admins and Faculty only");
  }

  const { id } = req.params;
  const { title, description, isPublic, category } = req.body;

  const newsFeed = await NewsFeed.findById(id);
  if (!newsFeed) {
    throw new ApiError(404, 'NewsFeed not found');
  }

  if (req.user.role !== "admin" && req.user._id.toString() !== newsFeed.postedBy.toString()) {
    throw new ApiError(403, "You can only update your own newsfeed");
  }

  newsFeed.title = title || newsFeed.title;
  newsFeed.description = description || newsFeed.description;
  newsFeed.category = category || newsFeed.category;
  newsFeed.isPublic = isPublic !== undefined ? isPublic : newsFeed.isPublic;
  
  if (req.savedImagePath) {
    // Update the image URL only if a new image is uploaded
    newsFeed.image = `${req.protocol}://${req.get('host')}${req.savedImagePath}`;
  }

  await newsFeed.save();
  res.status(200).json(new ApiResponse(200, newsFeed, 'NewsFeed updated successfully'));
});

// Fetch all public news and events with pagination
const fetchNewsFeeds = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let query = { isPublic: true }; // Default: Public newsfeeds for non-logged-in users

  //  If user is logged in, apply role-based filtering
  if (req.user) {
    if (req.user.role === "faculty") {
      query = { postedBy: req.user._id }; // Faculty sees only their own newsfeeds
    } else if (req.user.role === "admin") {
      query = {}; // Admin sees all newsfeeds (no filter)
    }
  }

  //  Ensure correct faculty filtering
  console.log(`Fetching newsfeeds for role: ${req.user?.role}`);
  console.log(`Applied Query:`, query);

  //  Get total count for pagination
  const totalItems = await NewsFeed.countDocuments(query);

  //  Fetch news feeds with pagination & include the poster's name
  const newsFeeds = await NewsFeed.find(query)
    .populate("postedBy", "fullName role") // Get the faculty/admin name
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalPages = Math.ceil(totalItems / limit);

  res.status(200).json({
    success: true,
    message: "NewsFeeds fetched successfully",
    data: newsFeeds,
    meta: {
      currentPage: page,
      totalPages,
      totalItems,
    },
  });
});

// Fetch a single news feed by ID
const fetchNewsFeedById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const newsFeed = await NewsFeed.findById(id);
  if (!newsFeed) {
    throw new ApiError(404, 'NewsFeed not found');
  }

  res.status(200).json(new ApiResponse(200, newsFeed, 'NewsFeed fetched successfully'));
});


const deleteNewsFeed = asyncHandler(async (req, res) => {
  if (!req.user || !['admin', 'faculty'].includes(req.user.role)) {
    throw new ApiError(403, "Forbidden: Admins and Faculty only");
  }

  const { id } = req.params;

  const newsFeed = await NewsFeed.findById(id);
  if (!newsFeed) {
    throw new ApiError(404, "NewsFeed not found");
  }

  //  Faculty can only delete their own posts
  if (req.user.role === "faculty" && newsFeed.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Forbidden: You can only delete your own news feeds.");
  }

  //  Admin can delete any newsFeed
  await newsFeed.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "NewsFeed deleted successfully"));
});


export { createNewsFeed, fetchNewsFeeds, fetchNewsFeedById, updateNewsFeed, deleteNewsFeed };

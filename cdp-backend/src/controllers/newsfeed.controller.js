import NewsFeed from '../models/newsfeed.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import path from 'path';


// Create a new news or event
const createNewsFeed = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
      throw new ApiError(403, 'Forbidden: Admins only');
  }

  const { title, description, isPublic } = req.body;
  const imagePath = req.savedImagePath || '';

  const imageUrl = `${req.protocol}://${req.get('host')}/temp/${path.basename(imagePath)}`;
  const newsFeed = new NewsFeed({ 
      title, 
      description, 
      image: imageUrl, 
      isPublic: isPublic !== undefined ? isPublic : true 
  });

  await newsFeed.save();
  res.status(201).json(new ApiResponse(201, newsFeed, 'NewsFeed created successfully'));
});



// Update a news or event
const updateNewsFeed = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admins only');
  }

  const { id } = req.params;
  const { title, description, isPublic } = req.body;

  const newsFeed = await NewsFeed.findById(id);
  if (!newsFeed) {
    throw new ApiError(404, 'NewsFeed not found');
  }

  newsFeed.title = title || newsFeed.title;
  newsFeed.description = description || newsFeed.description;
  newsFeed.isPublic = isPublic !== undefined ? isPublic : newsFeed.isPublic;
  
  if (req.savedImagePath) {
    newsFeed.image = req.savedImagePath; // Update image only if a new one is uploaded
  }

  await newsFeed.save();
  res.status(200).json(new ApiResponse(200, newsFeed, 'NewsFeed updated successfully'));
});

// Fetch all public news and events
const fetchNewsFeeds = asyncHandler(async (req, res) => {
  const newsFeeds = await NewsFeed.find({ isPublic: true });
  res.status(200).json(new ApiResponse(200, newsFeeds, 'NewsFeeds fetched successfully'));
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


// Delete a news or event (Admin only)
const deleteNewsFeed = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admins only');
  }

  const { id } = req.params;

  const newsFeed = await NewsFeed.findByIdAndDelete(id);
  if (!newsFeed) {
    throw new ApiError(404, 'NewsFeed not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'NewsFeed deleted successfully'));
});

export { createNewsFeed, fetchNewsFeeds, fetchNewsFeedById, updateNewsFeed, deleteNewsFeed };

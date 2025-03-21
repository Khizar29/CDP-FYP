const NewsFeed = require('../models/newsfeed.model.js');
const  asyncHandler  = require('../utils/asyncHandler.js');
const  ApiError  = require('../utils/ApiError.js');
const ApiResponse  = require('../utils/ApiResponse.js');
const path = require('path');
const { uploadFileToGoogleDrive, deleteLocalFile, getFilePublicUrl } = require('../utils/GoogleDrive.js');
const fs = require('fs');

const createNewsFeed = asyncHandler(async (req, res) => {
  if (!req.user || !['admin', 'faculty'].includes(req.user.role)) {
    throw new ApiError(403, "Forbidden: Admins and Faculty only");
  }

  const { title, description, category, isPublic } = req.body;
  const file = req.file; 

  let imageUrl = '';
    if (file) {
        try {
            const googleDriveFileId = await uploadFileToGoogleDrive(file);
            imageUrl = getFilePublicUrl(googleDriveFileId);
            console.log("Generated Google Drive URL:", imageUrl);

            // Remove local file
            deleteLocalFile(file.path);
        } catch (error) {
            console.error("File upload failed:", error);
            throw new ApiError(500, "File upload to Google Drive failed");
        }
    }

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
  const file = req.file;

  const newsFeed = await NewsFeed.findById(id);
  if (!newsFeed) {
    throw new ApiError(404, 'NewsFeed not found');
  }

  if (req.user.role !== "admin" && req.user._id.toString() !== newsFeed.postedBy.toString()) {
    throw new ApiError(403, "You can only update your own newsfeed");
  }

  let imageUrl = newsFeed.image;
    if (file) {
        // Upload the new image to Google Drive and get the public thumbnail URL
        const googleDriveFileId = await uploadFileToGoogleDrive(file);
        imageUrl = getFilePublicUrl(googleDriveFileId); 

        // Remove the file from local storage after uploading to Drive
        deleteLocalFile(file.path);
    }

  newsFeed.title = title || newsFeed.title;
  newsFeed.description = description || newsFeed.description;
  newsFeed.category = category || newsFeed.category;
  newsFeed.isPublic = isPublic !== undefined ? isPublic : newsFeed.isPublic;
  newsFeed.image = imageUrl;
  
  await newsFeed.save();
  res.status(200).json(new ApiResponse(200, newsFeed, 'NewsFeed updated successfully'));
});

// Fetch all public news and events with pagination
const fetchNewsFeeds = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let query = { isPublic: true }; // Default: Public newsfeeds for non-logged-in users

  if (req.user) {
    if (req.user.role === "faculty") {
      query = { postedBy: req.user._id }; // Faculty sees only their own newsfeeds
    } else if (req.user.role === "admin") {
      query = {}; // Admin sees all newsfeeds
    }
  }

  const totalItems = await NewsFeed.countDocuments(query);

  const newsFeeds = await NewsFeed.find(query)
    .populate("postedBy", "fullName role")
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

// Delete a news feed (Admin & Faculty)
const deleteNewsFeed = asyncHandler(async (req, res) => {
  if (!req.user || !['admin', 'faculty'].includes(req.user.role)) {
    throw new ApiError(403, "Forbidden: Admins and Faculty only");
  }

  const { id } = req.params;

  const newsFeed = await NewsFeed.findById(id);
  if (!newsFeed) {
    throw new ApiError(404, "NewsFeed not found");
  }

  if (req.user.role === "faculty" && newsFeed.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Forbidden: You can only delete your own news feeds.");
  }

  await newsFeed.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "NewsFeed deleted successfully"));
});

// Export functions using CommonJS syntax
module.exports = {
  createNewsFeed,
  fetchNewsFeeds,
  fetchNewsFeedById,
  updateNewsFeed,
  deleteNewsFeed
};

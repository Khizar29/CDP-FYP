const Graduate = require('../models/graduate.model.js');
const asyncHandler  = require('../utils/asyncHandler.js');
const ApiError  = require('../utils/ApiError.js');
const ApiResponse  = require('../utils/ApiResponse.js');
const XLSX = require('xlsx'); // Library to parse Excel files
const { uploadFileToGoogleDrive, deleteLocalFile, getFilePublicUrl } = require('../utils/GoogleDrive.js');
const fs = require('fs'); // To work with the filesystem

const BATCH_SIZE = 100; // Adjust batch size according to your needs

const importGraduates = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admins only');
  }

  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  try {
    const workbook = XLSX.readFile(`./public/temp/${req.file.filename}`);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    let graduatesData = XLSX.utils.sheet_to_json(worksheet);

    const validGraduates = [];
    const errors = [];

    for (let i = 0; i < graduatesData.length; i++) {
      let graduate = graduatesData[i];

      graduate.nuId = graduate.nuId ? graduate.nuId.toLowerCase().trim() : null;
      graduate.nuEmail = graduate.nuEmail ? graduate.nuEmail.toLowerCase().trim() : null;

      if (!graduate.nuId || !graduate.fullName || !graduate.nuEmail || !graduate.discipline || !graduate.yearOfGraduation || !graduate.cgpa) {
        errors.push(`Row ${i + 1}: Missing required field(s).`);
        continue;
      }

      // ✅ Just store skills as they appear in the Excel sheet
      graduate.skills = graduate.skills ? [graduate.skills] : [];  

      validGraduates.push(graduate);
    }

    if (validGraduates.length === 0) {
      return res.status(400).json(new ApiError(400, 'No valid records to import.'));
    }

    let totalInserted = 0;
    let totalFailed = 0;

    for (let i = 0; i < validGraduates.length; i += BATCH_SIZE) {
      const batch = validGraduates.slice(i, i + BATCH_SIZE);
      try {
        const result = await Graduate.insertMany(batch, { ordered: false });
        totalInserted += result.length;
      } catch (error) {
        console.error('Error inserting batch:', error);
        totalFailed += error.writeErrors ? error.writeErrors.length : 0;
      }
    }

    fs.unlinkSync(`./public/temp/${req.file.filename}`);

    return res.status(201).json(
      new ApiResponse(
        201,
        { totalInserted, totalFailed },
        `Successfully imported ${totalInserted} graduates. ${totalFailed} records failed.`
      )
    );
  } catch (error) {
    console.error('Error importing graduates:', error);
    return res.status(500).json(new ApiError(500, 'Failed to import graduates', error.message));
  }
});



const updateGraduate = asyncHandler(async (req, res) => {
  const { nuId } = req.params;

  if (!req.user) {
    throw new ApiError(403, 'Unauthorized: User not authenticated');
  }

  const graduate = await Graduate.findOne({ nuId });
  if (!graduate) {
    throw new ApiError(404, 'Graduate not found');
  }

  if (req.user.role === 'user' && req.user.nuId !== graduate.nuId) {
    throw new ApiError(403, 'Forbidden: You can only update your own profile');
  }

  const allowedFields = [
    "personalEmail",
    "contact",
    "tagline",
    "personalExperience",
    "certificate",
    "fyp",
  ];

  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      graduate[key] = req.body[key];
    }
  });

  if (req.file) {
    try {
      const fileId = await uploadFileToGoogleDrive(req.file);
      const profilePicUrl = getFilePublicUrl(fileId);

      graduate.profilePic = profilePicUrl;
      deleteLocalFile(req.file.path);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw new ApiError(500, "Failed to upload profile picture");
    }
  }

  await graduate.save();
  res.status(200).json(new ApiResponse(200, graduate, "Graduate updated successfully"));
});

// Delete a graduate profile (Admin only)
const deleteGraduate = asyncHandler(async (req, res) => {
  const { nuId } = req.params;

  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admins only');
  }

  const graduate = await Graduate.findOneAndDelete({ nuId });

  if (!graduate) {
    throw new ApiError(404, 'Graduate not found');
  }

  return res.status(200).json(new ApiResponse(200, null, 'Graduate deleted successfully'));
});

// Fetch paginated graduates with filters (Public route)
const fetchGraduates = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { searchTerm, filterYear, filterDiscipline } = req.query;

  const criteria = {};
  if (searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    criteria.$or = [{ fullName: regex }, { nuId: regex }];
  }
  if (filterYear) {
    criteria.yearOfGraduation = filterYear;
  }
  if (filterDiscipline) {
    criteria.discipline = filterDiscipline;
  }

  try {
    const totalGraduates = await Graduate.countDocuments(criteria);
    const graduates = await Graduate.find(criteria).skip(skip).limit(limit);

    return res.status(200).json({
      data: graduates,
      totalPages: Math.ceil(totalGraduates / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching graduates:', error);
    return res.status(500).json(new ApiError(500, 'Failed to fetch graduates', error.message));
  }
});

// Fetch a single Graduate by ID
const getGraduateById = asyncHandler(async (req, res) => {
  const { nuId } = req.params;

  const graduate = await Graduate.findOne({ nuId });

  if (!graduate) {
    throw new ApiError(404, 'Graduate not found');
  }

  return res.status(200).json(new ApiResponse(200, graduate, 'Graduate fetched successfully'));
});

const getGraduateCount = async (req, res) => {
  try {
    const count = await Graduate.countDocuments();
    return res.status(200).json(new ApiResponse(200, { count }, 'Graduate count retrieved successfully'));
  } catch (error) {
    console.error('Error counting Graduates:', error);
    return res.status(500).json(new ApiError(500, 'Error counting Graduate', error.message));
  }
};

// Get neighboring graduates (previous and next)
const getGraduateNeighbors = asyncHandler(async (req, res) => {
  const { nuId } = req.params;
  
  try {
    // Find the current graduate by nuId
    const current = await Graduate.findOne({ nuId });
    if (!current) {
      throw new ApiError(404, 'Graduate not found');
    }

    // Find previous graduate
    const prev = await Graduate.findOne({ 
      fullName: { $lt: current.fullName } 
    }).sort({ fullName: -1 }).limit(1).select('nuId');

    // Find next graduate
    const next = await Graduate.findOne({ 
      fullName: { $gt: current.fullName } 
    }).sort({ fullName: 1 }).limit(1).select('nuId');

    res.status(200).json(new ApiResponse(200, {
      prev: prev ? prev.nuId : null,
      next: next ? next.nuId : null
    }, "Neighbors fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Error fetching neighboring graduates", error.message);
  }
});

// Export all functions using CommonJS syntax
module.exports = {
  importGraduates,
  updateGraduate,
  deleteGraduate,
  fetchGraduates,
  getGraduateById,
  getGraduateCount,
  getGraduateNeighbors,
};

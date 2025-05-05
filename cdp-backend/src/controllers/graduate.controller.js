const Graduate = require('../models/graduate.model.js');
const asyncHandler  = require('../utils/asyncHandler.js');
const ApiError  = require('../utils/ApiError.js');
const ApiResponse  = require('../utils/ApiResponse.js');
const XLSX = require('xlsx'); // Library to parse Excel files
const { uploadFileToGoogleDrive, deleteLocalFile, getFilePublicUrl } = require('../utils/GoogleDrive.js');
const fs = require('fs'); // To work with the filesystem
const { log } = require('console');

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

    // Function to parse skills from Excel
    const parseSkills = (skillsInput) => {
      if (!skillsInput) return [];
      if (Array.isArray(skillsInput)) return skillsInput; // Already formatted
      
      // Handle string input (comma, semicolon, or pipe separated)
      return skillsInput
        .split(/[,;|]/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
    };

    for (let i = 0; i < graduatesData.length; i++) {
      let graduate = graduatesData[i];

      // Standardize fields
      graduate.nuId = graduate.nuId ? graduate.nuId.toLowerCase().trim() : null;
      graduate.nuEmail = graduate.nuEmail ? graduate.nuEmail.toLowerCase().trim() : null;

      // Validate required fields
      if (!graduate.nuId || !graduate.fullName || !graduate.nuEmail || 
          !graduate.discipline || !graduate.yearOfGraduation || !graduate.cgpa) {
        errors.push(`Row ${i + 1}: Missing required field(s).`);
        continue;
      }

      // Process skills
      graduate.skills = parseSkills(graduate.skills);
      
      // Mark as graduate
      graduate.isGraduate = true;

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
        const result = await Graduate.insertMany(batch, { 
          ordered: false,
          rawResult: true 
        });
        totalInserted += result.insertedCount;
      } catch (error) {
        console.error('Error inserting batch:', error);
        if (error.writeErrors) {
          totalFailed += error.writeErrors.length;
          // Log detailed errors
          error.writeErrors.forEach(e => {
            console.error(`Failed to insert record: ${e.errmsg}`);
          });
        } else {
          totalFailed += batch.length;
        }
      }
    }

    fs.unlinkSync(`./public/temp/${req.file.filename}`);

    return res.status(201).json(
      new ApiResponse(
        201,
        { 
          totalInserted,
          totalFailed,
          errors: errors.length > 0 ? errors : undefined
        },
        `Import complete. Success: ${totalInserted}, Failed: ${totalFailed}`
      )
    );
  } catch (error) {
    console.error('Error importing graduates:', error);
    return res.status(500).json(
      new ApiError(500, 'Failed to import graduates', error.message)
    );
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
    "cgpa",
    "discipline",
    "skills",
    "personalEmail",
    "contact",
    "tagline",
    "yearOfGraduation",
    "personalExperience",
    "certificate",
    "fyp",
  ];

  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      // Special handling for skills array
      if (key === 'skills') {
        graduate[key] = Array.isArray(req.body[key]) 
          ? req.body[key]
          : typeof req.body[key] === 'string'
            ? JSON.parse(req.body[key])
            : [];
      } else {
        graduate[key] = req.body[key];
      }
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

  // Validate before saving
  try {
    await graduate.validate();
  } catch (validationError) {
    throw new ApiError(400, validationError.message);
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
// Fetch paginated graduates or students with filters (Public route)
const fetchGraduates = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { searchTerm, filterYear, filterDiscipline, type = 'graduate' } = req.query;

  const criteria = {};
  criteria.isGraduate = type === 'graduate';

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
    const total = await Graduate.countDocuments(criteria);
    const results = await Graduate.find(criteria).skip(skip).limit(limit);

    return res.status(200).json({
      data: results,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching records:', error);
    return res.status(500).json(new ApiError(500, 'Failed to fetch records', error.message));
  }
});


// Public - Show only graduates
const getGraduateById = asyncHandler(async (req, res) => {
  const { nuId } = req.params;

  const graduate = await Graduate.findOne({ nuId });

  if (!graduate) {
    throw new ApiError(404, 'Graduate not found');
  }

  return res.status(200).json(new ApiResponse(200, graduate, 'Graduate fetched successfully'));
});

// const getGraduateById = asyncHandler(async (req, res) => {
//   const { nuId } = req.params;

//   let graduate;
  
//   if (req.user && req.user.nuId === nuId ) {
//     // If the logged-in user is accessing their own profile, show it regardless
//     graduate = await Graduate.findOne({ nuId });
//   } else {
//     // Public viewers only see graduates
//     graduate = await Graduate.findOne({ nuId, isGraduate: true });
//   }

//   if (!graduate) {
//     throw new ApiError(404, 'Graduate not found');
//   }

//   return res.status(200).json(new ApiResponse(200, graduate, 'Graduate fetched successfully'));
// });

const getOrCreateGraduateProfile = asyncHandler(async (req, res) => {
  const { nuId } = req.params;

  let graduate = await Graduate.findOne({ nuId });

  if (!graduate) {
    const { fullName, email } = req.user;

    graduate = await Graduate.create({
      nuId,
      fullName: fullName || 'New Student',
      nuEmail: email || `${nuId}@nu.edu.pk`,
      isGraduate: false,
      skills: [],
    });
  }

  return res.status(200).json(new ApiResponse(200, graduate, 'Graduate profile ready'));
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
  let type = req.query.type;

  // Fallback if type is not given
  if (!type) {
    const target = await Graduate.findOne({ nuId });
    if (!target) {
      throw new ApiError(404, 'Graduate not found');
    }
    type = target.isGraduate ? "graduate" : "student";
  }

  const isGraduate = type === "graduate";

  const current = await Graduate.findOne({ nuId, isGraduate });
  if (!current) {
    throw new ApiError(404, 'Graduate not found');
  }

  const prev = await Graduate.findOne({
    fullName: { $lt: current.fullName },
    isGraduate
  }).sort({ fullName: -1 }).limit(1).select('nuId');

  const next = await Graduate.findOne({
    fullName: { $gt: current.fullName },
    isGraduate
  }).sort({ fullName: 1 }).limit(1).select('nuId');

  res.status(200).json(new ApiResponse(200, {
    prev: prev ? prev.nuId : null,
    next: next ? next.nuId : null
  }, "Neighbors fetched successfully"));
});


const markAsGraduated = asyncHandler(async (req, res) => {
  const { nuId } = req.params;

  const graduate = await Graduate.findOne({ nuId });

  if (!graduate || graduate.isGraduate) {
    throw new ApiError(400, 'User not found or already a graduate');
  }

  // Extract enrollment year
  const enrollmentYear = 2000 + parseInt(nuId.substring(0, 2));
  const currentYear = new Date().getFullYear();

  const hasCompletedFourYears = currentYear - enrollmentYear >= 4;

  if (!hasCompletedFourYears) {
    throw new ApiError(403, `Graduation not allowed before completing 4 years (Enrolled: ${enrollmentYear})`);
  }

  graduate.isGraduate = true;
  graduate.yearOfGraduation = currentYear;
  graduate.graduationDate = new Date();

  await graduate.save();

  return res.status(200).json(
    new ApiResponse(200, graduate, 'Marked as graduated')
  );
});


// Export all functions using CommonJS syntax
module.exports = {
  importGraduates,
  updateGraduate,
  deleteGraduate,
  fetchGraduates,
  getGraduateById,
  getOrCreateGraduateProfile,
  getGraduateCount,
  getGraduateNeighbors,
  markAsGraduated,
};

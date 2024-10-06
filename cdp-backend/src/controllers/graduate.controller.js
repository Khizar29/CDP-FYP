import Graduate from '../models/graduate.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import XLSX from 'xlsx'; // Library to parse Excel files
import fs from 'fs'; // To work with the filesystem

const BATCH_SIZE = 100; // Adjust batch size according to your needs

const importGraduates = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admins only');
  }

  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  try {
    const workbook = XLSX.readFile(`./public/temp/${req.file.originalname}`);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    let graduatesData = XLSX.utils.sheet_to_json(worksheet);

    const validGraduates = [];
    const errors = [];
    const duplicateNuIds = [];
    const duplicateNuEmails = [];

    for (let i = 0; i < graduatesData.length; i++) {
      let graduate = graduatesData[i];

      // Normalize and trim data
      graduate.nuId = graduate.nuId ? graduate.nuId.toLowerCase().trim() : null;
      graduate.nuEmail = graduate.nuEmail ? graduate.nuEmail.toLowerCase().trim() : null;

      // Check for missing required fields
      if (!graduate.nuId || !graduate.firstName || !graduate.lastName || !graduate.nuEmail || !graduate.discipline || !graduate.yearOfGraduation || !graduate.cgpa) {
        errors.push(`Row ${i + 1}: Missing required field(s).`);
        continue;
      }

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
        const result = await Graduate.insertMany(batch, { ordered: false }); // Continue on error
        totalInserted += result.length;
      } catch (error) {
        // Handle duplicate key errors and log specific duplicates
        if (error.code === 11000) {
          const dupKeyError = error.writeErrors || [];
          dupKeyError.forEach(err => {
            const { keyValue } = err.err || {};
            if (keyValue && keyValue.nuEmail) {
              duplicateNuEmails.push(keyValue.nuEmail);
            } else if (keyValue && keyValue.nuId) {
              duplicateNuIds.push(keyValue.nuId);
            }
          });
          totalFailed += error.writeErrors.length;  // Increment failed insert count
        } else {
          console.error('Error inserting batch:', error);
        }
      }
    }

    fs.unlinkSync(`./public/temp/${req.file.originalname}`);

    // Return a more accurate response message
    return res.status(201).json(
      new ApiResponse(
        201,
        { totalInserted, totalFailed },
        `Successfully imported ${totalInserted} graduates. ${totalFailed} records failed. Duplicates: nuId(s): ${duplicateNuIds.join(', ')}. nuEmail(s): ${duplicateNuEmails.join(', ')}.`
      )
    );
  } catch (error) {
    console.error('Error importing graduates:', error);
    return res.status(500).json(new ApiError(500, 'Failed to import graduates', error.message));
  }
});



// Update a graduate's information (Admin only)
const updateGraduate = asyncHandler(async (req, res) => {
  const { nuId } = req.params;
  const { firstName, lastName, nuEmail, personalEmail, discipline, yearOfGraduation, cgpa, profilePic, contact, tagline, personalExperience, certificate, fyp } = req.body;

  // Ensure the user is authenticated
  if (!req.user) {
    throw new ApiError(403, 'Unauthorized: User not authenticated');
  }

  // Find the graduate by nuId
  const graduate = await Graduate.findOne({ nuId });

  if (!graduate) {
    throw new ApiError(404, 'Graduate not found');
  }

  // Ensure the graduate can only update their own profile (if the user is a graduate)
  if (req.user.role === 'user' && req.user.nuId !== graduate.nuId) {
    throw new ApiError(403, 'Forbidden: You can only update your own profile');
  }

  // Fields that can be updated by a graduate (non-admin user)
  const allowedFieldsForGraduate = {
    personalEmail: personalEmail || graduate.personalEmail,
    contact: contact || graduate.contact,
    tagline: tagline || graduate.tagline,
    profilePic: profilePic || graduate.profilePic,
    personalExperience: personalExperience || graduate.personalExperience,
    certificate: certificate || graduate.certificate,
    fyp: fyp || graduate.fyp,
  };

  // Check the role of the user
  if (req.user.role === 'admin') {
    // Admins can update all fields
    graduate.firstName = firstName || graduate.firstName;
    graduate.lastName = lastName || graduate.lastName;
    graduate.nuEmail = nuEmail || graduate.nuEmail;
    graduate.discipline = discipline || graduate.discipline;
    graduate.yearOfGraduation = yearOfGraduation || graduate.yearOfGraduation;
    graduate.cgpa = cgpa || graduate.cgpa;

    // Admins can also update the fields that graduates can update
    Object.assign(graduate, allowedFieldsForGraduate);
  } else if (req.user.role === 'user') {
    // Non-admin (graduate) users can only update certain fields
    Object.assign(graduate, allowedFieldsForGraduate);
  }

  await graduate.save();

  return res.status(200).json(new ApiResponse(200, graduate, 'Graduate updated successfully'));
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


// Fetch paginated graduates information (Public route)
const fetchGraduates = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 graduates per page
  const skip = (page - 1) * limit; // Calculate how many records to skip

  try {
    const totalGraduates = await Graduate.countDocuments(); // Get total count of graduates
    const graduates = await Graduate.find().skip(skip).limit(limit); // Fetch paginated graduates

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
    const count = await Graduate.countDocuments(); // Count the documents in the Graduate collection
    return res.status(200).json(new ApiResponse(200, { count }, 'Graduate count retrieved successfully'));
  } catch (error) {
    console.error('Error counting Graduates:', error);
    return res.status(500).json(new ApiError(500, 'Error counting Graduate', error.message));
  }
};
export {
  importGraduates,
  updateGraduate,
  deleteGraduate,
  fetchGraduates,
  getGraduateById,
  getGraduateCount
};

import Graduate from '../models/graduate.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import XLSX from 'xlsx'; // Library to parse Excel files
import fs from 'fs'; // To work with the filesystem

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

      // Check for duplicates in the database by nuId
      const existingGraduateByNuId = await Graduate.findOne({ nuId: graduate.nuId });
      if (existingGraduateByNuId) {
        duplicateNuIds.push(graduate.nuId);
        continue;
      }

      // Check for duplicates in the database by nuEmail
      const existingGraduateByNuEmail = await Graduate.findOne({ nuEmail: graduate.nuEmail });
      if (existingGraduateByNuEmail) {
        duplicateNuEmails.push(graduate.nuEmail);
        continue;
      }

      // Add valid graduate to array
      validGraduates.push(graduate);
    }

    // If no valid records found
    if (validGraduates.length === 0 && (duplicateNuIds.length > 0 || duplicateNuEmails.length > 0)) {
      return res.status(400).json(
        new ApiError(
          400,
          `No new records to import. Duplicate nuId(s): ${duplicateNuIds.join(', ')}. Duplicate nuEmail(s): ${duplicateNuEmails.join(', ')}.`
        )
      );
    }

    // Insert valid records into the database
    const graduates = await Graduate.insertMany(validGraduates);
    fs.unlinkSync(`./public/temp/${req.file.originalname}`);

    // Return detailed response with errors
    return res.status(201).json(
      new ApiResponse(
        201,
        graduates,
        `Graduates imported successfully. ${errors.length} records skipped. Duplicate nuId(s): ${duplicateNuIds.join(', ')}. Duplicate nuEmail(s): ${duplicateNuEmails.join(', ')}.`
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

  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admins only');
  }

  const graduate = await Graduate.findOne({ nuId });

  if (!graduate) {
    throw new ApiError(404, 'Graduate not found');
  }

  // Update the fields that are provided in the request body
  graduate.firstName = firstName || graduate.firstName;
  graduate.lastName = lastName || graduate.lastName;
  graduate.nuEmail = nuEmail || graduate.nuEmail;
  graduate.personalEmail = personalEmail || graduate.personalEmail;
  graduate.discipline = discipline || graduate.discipline;
  graduate.yearOfGraduation = yearOfGraduation || graduate.yearOfGraduation;
  graduate.cgpa = cgpa || graduate.cgpa;
  graduate.profilePic = profilePic || graduate.profilePic;
  graduate.contact = contact || graduate.contact;
  graduate.tagline = tagline || graduate.tagline;
  graduate.personalExperience = personalExperience || graduate.personalExperience;
  graduate.certificate = certificate || graduate.certificate;
  graduate.fyp = fyp || graduate.fyp;

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

// Fetch all graduates information (Public route)
const fetchGraduates = asyncHandler(async (req, res) => {
  try {
    const graduates = await Graduate.find();
    return res.status(200).json(new ApiResponse(200, graduates, 'Graduates fetched successfully'));
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

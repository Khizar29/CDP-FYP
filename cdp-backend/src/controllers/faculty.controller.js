import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Faculty from "../models/faculty.model.js";
import { User } from "../models/user.model.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

/**
 * Register a faculty member (public route)
 */
const registerFaculty = asyncHandler(async (req, res) => {
  const { fullName, nuEmail, phoneNumber, department } = req.body;
  console.log(fullName,nuEmail,phoneNumber,department);

  if (!fullName || !nuEmail || !phoneNumber || !department) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if the faculty is already registered
  const existingFaculty = await Faculty.findOne({ nuEmail });
  if (existingFaculty) {
    throw new ApiError(409, "Faculty with this email already exists");
  }

  // Create a new faculty record
  const faculty = await Faculty.create({
    fullName,
    nuEmail,
    phoneNumber,
    department,
  });

  return res.status(201).json(
    new ApiResponse(201, faculty, "Faculty registered successfully. Pending admin approval.")
  );
});

/**
 * Get all faculty members (admin route)
 */
const getAllFaculty = asyncHandler(async (req, res) => {
  const facultyMembers = await Faculty.find();

  return res.status(200).json(
    new ApiResponse(200, facultyMembers, "All faculty members fetched successfully.")
  );
});

/**
 * Get pending faculty for admin verification
 */
const getPendingFaculty = asyncHandler(async (req, res) => {
  const pendingFaculty = await Faculty.find({ isVerified: false });

  return res.status(200).json(
    new ApiResponse(200, pendingFaculty, "Pending faculty fetched successfully.")
  );
});

/**
 * Admin verifies a faculty member (protected route)
 */
const verifyFaculty = asyncHandler(async (req, res) => {
  const { facultyId } = req.params;

  // Find the faculty member
  const faculty = await Faculty.findById(facultyId);
  if (!faculty) {
    throw new ApiError(404, "Faculty not found");
  }

  if (faculty.isVerified) {
    throw new ApiError(400, "Faculty is already verified");
  }

  // Check if the email already exists in the User model
  const existingUser = await User.findOne({ email: faculty.nuEmail });
  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists");
  }

  // Generate a password
  const generatedPassword = crypto.randomBytes(8).toString("hex");

  // Create User
  const user = await User.create({
    email: faculty.nuEmail,
    fullName: faculty.fullName,
    password: generatedPassword,
    role: "faculty", // Set role as faculty
  });

  try {
    // Send email to the faculty member
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Career Services and IL Office Karachi" <${process.env.GMAIL}>`,
      to: faculty.nuEmail,
      subject: "Your Faculty Account is Verified",
      html: `<p>Hello ${faculty.fullName},</p>
             <p>Your faculty account has been verified. You can now log in to the portal using the following credentials:</p>
             <p><strong>Email:</strong> ${faculty.nuEmail}</p>
             <p><strong>Password:</strong> ${generatedPassword}</p>
             <p>Please change your password after logging in.</p>
             <p style="font-size: medium; color: black;">
             <b>Best Regards,</b><br>
              Industrial Liaison/Career Services Office<br>
              021 111 128 128 ext. 184
             </p>`,
    };

    await transporter.sendMail(mailOptions);

    // Mark as verified only after successful email sending
    faculty.isVerified = true;
    faculty.verifiedAt = new Date();
    await faculty.save();

    return res.status(200).json(
      new ApiResponse(200, { user }, "Faculty verified successfully and credentials sent via email.")
    );
  } catch (error) {
    // Rollback user creation if email sending fails
    await User.findByIdAndDelete(user._id);

    console.error("Error sending email:", error);
    throw new ApiError(500, "Failed to send verification email. Faculty not verified.");
  }
});

/**
 * Admin un-verifies a faculty member (protected route)
 */
const unverifyFaculty = asyncHandler(async (req, res) => {
  const { facultyId } = req.params;

  const faculty = await Faculty.findById(facultyId);
  if (!faculty) {
    throw new ApiError(404, "Faculty not found");
  }

  if (!faculty.isVerified) {
    throw new ApiError(400, "Faculty is already unverified");
  }

  // Delete associated user account
  const user = await User.findOneAndDelete({ email: faculty.nuEmail });

  faculty.isVerified = false;
  faculty.verifiedAt = null;
  await faculty.save();

  return res.status(200).json(
    new ApiResponse(200, { faculty, deletedUser: user }, "Faculty unverified successfully.")
  );
});

/**
 * Admin deletes a faculty member (protected route)
 */
const deleteFaculty = asyncHandler(async (req, res) => {
  const { facultyId } = req.params;

  const faculty = await Faculty.findById(facultyId);
  if (!faculty) {
    throw new ApiError(404, "Faculty not found");
  }

  // Delete associated user account if exists
  await User.findOneAndDelete({ email: faculty.nuEmail });

  await faculty.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, "Faculty deleted successfully."));
});

export {
  registerFaculty,
  getAllFaculty,
  getPendingFaculty,
  verifyFaculty,
  unverifyFaculty,
  deleteFaculty,
};

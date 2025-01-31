import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Recruiter from "../models/recruiter.model.js";
import { User } from "../models/user.model.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

/**
 * Register a recruiter (public route)
 */
const registerRecruiter = asyncHandler(async (req, res) => {
  const { fullName, companyName, companyEmail, companyPhone, designation } = req.body;

  if (!fullName || !companyName || !companyEmail || !companyPhone || !designation) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if the recruiter is already registered
  const existingRecruiter = await Recruiter.findOne({ companyEmail });
  if (existingRecruiter) {
    throw new ApiError(409, "Recruiter with this company email already exists");
  }

  // Create a new recruiter
  const recruiter = await Recruiter.create({
    fullName,
    companyName,
    companyEmail,
    companyPhone,
    designation,
  });

  return res.status(201).json(
    new ApiResponse(201, recruiter, "Recruiter registered successfully. Pending admin approval.")
  );
});

/**
 * Get all recruiters (admin route)
 */
const getAllRecruiters = asyncHandler(async (req, res) => {
  const recruiters = await Recruiter.find();

  return res.status(200).json(
    new ApiResponse(200, recruiters, "All recruiters fetched successfully.")
  );
});

/**
 * Get pending recruiters for admin (protected route)
 */
const getPendingRecruiters = asyncHandler(async (req, res) => {
  const recruiters = await Recruiter.find({ isVerified: false });

  return res.status(200).json(
    new ApiResponse(200, recruiters, "Pending recruiters fetched successfully.")
  );
});

/**
 * Admin verifies a recruiter (protected route)
 */
const verifyRecruiter = asyncHandler(async (req, res) => {
  const { recruiterId } = req.params;

  // Find the recruiter
  const recruiter = await Recruiter.findById(recruiterId);
  if (!recruiter) {
    throw new ApiError(404, "Recruiter not found");
  }

  if (recruiter.isVerified) {
    throw new ApiError(400, "Recruiter is already verified");
  }

  // Check if the email already exists in the User model
  const existingUser = await User.findOne({ email: recruiter.companyEmail });
  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists");
  }

  // Generate a password
  const generatedPassword = crypto.randomBytes(8).toString("hex");

  // Create User
  const user = await User.create({
    email: recruiter.companyEmail,
    fullName: recruiter.fullName,
    password: generatedPassword,
    role: "recruiter", // Set role as recruiter
  });

  try {
    // Send email to the recruiter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Career Services and IL Office Karachi" <${process.env.GMAIL}>`,
      to: recruiter.companyEmail,
      subject: "Your Recruiter Account is Verified",
      html: `<p>Hello ${recruiter.fullName},</p>
             <p>Your recruiter account has been verified. You can now log in to the portal using the following credentials:</p>
             <p><strong>Email:</strong> ${recruiter.companyEmail}</p>
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
    recruiter.isVerified = true;
    recruiter.verifiedAt = new Date();
    await recruiter.save();

    return res.status(200).json(
      new ApiResponse(200, { user }, "Recruiter verified successfully and credentials sent via email.")
    );
  } catch (error) {
    // Rollback user creation if email sending fails
    await User.findByIdAndDelete(user._id);

    console.error("Error sending email:", error);
    throw new ApiError(500, "Failed to send verification email. Recruiter not verified.");
  }
});

/**
 * Admin un-verifies a recruiter (protected route)
 */
const unverifyRecruiter = asyncHandler(async (req, res) => {
  const { recruiterId } = req.params;

  const recruiter = await Recruiter.findById(recruiterId);
  if (!recruiter) {
    throw new ApiError(404, "Recruiter not found");
  }

  if (!recruiter.isVerified) {
    throw new ApiError(400, "Recruiter is already unverified");
  }

  // Delete associated user account
  const user = await User.findOneAndDelete({ email: recruiter.companyEmail });

  recruiter.isVerified = false;
  recruiter.verifiedAt = null;
  await recruiter.save();

  return res.status(200).json(
    new ApiResponse(200, { recruiter, deletedUser: user }, "Recruiter unverified successfully.")
  );
});

/**
 * Admin deletes a recruiter (protected route)
 */
const deleteRecruiter = asyncHandler(async (req, res) => {
  const { recruiterId } = req.params;

  const recruiter = await Recruiter.findById(recruiterId);
  if (!recruiter) {
    throw new ApiError(404, "Recruiter not found");
  }

  // Delete associated user account if exists
  await User.findOneAndDelete({ email: recruiter.companyEmail });

  await recruiter.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, "Recruiter deleted successfully."));
});

/**
 * Admin updates recruiter details (protected route)
 */
const updateRecruiter = asyncHandler(async (req, res) => {
  const { recruiterId } = req.params;
  const { fullName, companyName, companyEmail, companyPhone, designation } = req.body;

  const recruiter = await Recruiter.findById(recruiterId);
  if (!recruiter) {
    throw new ApiError(404, "Recruiter not found");
  }

  recruiter.fullName = fullName || recruiter.fullName;
  recruiter.companyName = companyName || recruiter.companyName;
  recruiter.companyEmail = companyEmail || recruiter.companyEmail;
  recruiter.companyPhone = companyPhone || recruiter.companyPhone;
  recruiter.designation = designation || recruiter.designation;

  await recruiter.save();

  return res.status(200).json(new ApiResponse(200, recruiter, "Recruiter details updated successfully."));
});

export {
  registerRecruiter,
  getAllRecruiters,
  getPendingRecruiters,
  verifyRecruiter,
  unverifyRecruiter,
  deleteRecruiter,
  updateRecruiter,
};
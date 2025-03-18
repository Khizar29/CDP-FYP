const asyncHandler  = require("../utils/asyncHandler.js");
const ApiError  = require("../utils/ApiError.js");
const  ApiResponse  = require("../utils/ApiResponse.js");
const Faculty = require("../models/faculty.model.js");
const User  = require("../models/user.model.js");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { sendEmail } = require("../utils/EmailUtil.js");

/**
 * Register a faculty member (public route)
 */
const registerFaculty = asyncHandler(async (req, res) => {
  const { fullName, nuEmail, phoneNumber, department } = req.body;

  // Validate required fields
  if (!fullName || !nuEmail || !phoneNumber || !department) {
    throw new ApiError(400, "All fields are required", {
      errors: {
        ...(!fullName && { fullName: "Full name is required" }),
        ...(!nuEmail && { nuEmail: "NU email is required" }),
        ...(!phoneNumber && { phoneNumber: "Phone number is required" }),
        ...(!department && { department: "Department is required" }),
      },
    });
  }

  // Validate NU email format (if needed)
  const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@nu\.edu\.pk$/;
  if (!emailRegex.test(nuEmail)) {
    throw new ApiError(400, "Invalid email format. Example: firstname.lastname@nu.edu.pk", {
      errors: {
        nuEmail: "Invalid email format. Example: firstname.lastname@nu.edu.pk",
      },
    });
  }

  // Check if the faculty is already registered
  const existingFaculty = await Faculty.findOne({ nuEmail });
  if (existingFaculty) {
    throw new ApiError(409, "Faculty with this email already exists", {
      errors: {
        nuEmail: "This email is already registered",
      },
    });
  }

  // Create a new faculty record
  const faculty = await Faculty.create({
    fullName,
    nuEmail,
    phoneNumber,
    department,
  });

  try {
    // Email to Admin
    const adminEmailContent = `
      <p>Hello Admin,</p>
      <p>A new Faculty has registered and is pending your approval:</p>
      <p><strong>Faculty Name:</strong> ${faculty.fullName}</p>
      <p><strong>Faculty Email:</strong> ${faculty.nuEmail}</p>
      <p><strong>Faculty Phone:</strong> ${faculty.phoneNumber}</p>
      <p><strong>Department:</strong> ${faculty.department}</p>
      <p>Please review and approve the registration at your earliest convenience.</p>
      <p style="font-size: medium; color: black;">
        <b>Best Regards,</b><br>
        Industrial Liaison/Career Services Office<br>
        021 111 128 128 ext. 184
      </p>
    `;
    await sendEmail("s.khizarali03@gmail.com", "New Faculty Registration Pending Approval", adminEmailContent);

    // Email to Recruiter
    const FacultyEmailContent = `
      <p>Hello ${faculty.fullName},</p>
      <p>Thank you for registering as a Faculty. Your account is pending admin approval.</p>
      <p>You will receive a confirmation email once your account is approved.</p>
      <p style="font-size: medium; color: black;">
        <b>Best Regards,</b><br>
        Industrial Liaison/Career Services Office<br>
        021 111 128 128 ext. 184
      </p>
    `;
    await sendEmail(faculty.nuEmail, "Faculty Registration Received", FacultyEmailContent);

    return res.status(201).json(
      new ApiResponse(201, faculty, "Faculty registered successfully. Pending admin approval.")
    );
  } catch (error) {
    console.error("Error sending emails:", error);
    throw new ApiError(500, "Failed to send confirmation emails. Faculty registration saved, but emails not sent.");
  }
});

/**
 * Get all faculty members (admin route)
 */
const getAllFaculty = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, searchTerm = "", filterStatus = "" } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  const query = {};

  // Apply search filters
  if (searchTerm) {
    query.$or = [
      { fullName: { $regex: searchTerm, $options: "i" } },
      { nuEmail: { $regex: searchTerm, $options: "i" } },
    ];
  }

  // Apply status filter
  if (filterStatus === "verified") query.isVerified = true;
  if (filterStatus === "pending") query.isVerified = false;

  const total = await Faculty.countDocuments(query);

  const facultymembers = await Faculty.find(query)
    .sort({ createdAt: -1 }) // Sort by latest created recruiters
    .skip((page - 1) * limit)
    .limit(limit);

  return res.status(200).json(
    new ApiResponse(200, facultymembers, "All faculty members fetched successfully.", {
      totalJobs: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    })
  );
});

const updateFaculty = asyncHandler(async (req, res) => {
  const { facultyId } = req.params;
  const { fullName, nuEmail, phoneNumber, department } = req.body;

  const faculty = await Faculty.findById(facultyId);
  if (!faculty) {
    throw new ApiError(404, "Recruiter not found");
  }

  faculty.fullName = fullName || faculty.fullName;
  faculty.nuEmail = nuEmail || faculty.nuEmail;
  faculty.phoneNumber = phoneNumber || faculty.phoneNumber;
  faculty.department = department || faculty.department;

  await faculty.save();

  return res
    .status(200)
    .json(new ApiResponse(200, faculty, "Recruiter details updated successfully."));
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

    return res
      .status(200)
      .json(
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

  return res
    .status(200)
    .json(new ApiResponse(200, { faculty, deletedUser: user }, "Faculty unverified successfully."));
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

// Export all functions using CommonJS syntax
module.exports = {
  registerFaculty,
  getAllFaculty,
  updateFaculty,
  getPendingFaculty,
  verifyFaculty,
  unverifyFaculty,
  deleteFaculty,
};

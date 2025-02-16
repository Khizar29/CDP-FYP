import Announcement from "../models/announcement.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import nodemailer from "nodemailer";

/**
 * Create an announcement (Admin & Faculty only)
 */
export const createAnnouncement = asyncHandler(async (req, res) => {
  const { heading, text } = req.body;

  if (!heading || !text) {
    throw new ApiError(400, "Heading and text are required");
  }
  if (!req.user || !['admin', 'faculty'].includes(req.user.role)) {
    throw new ApiError(403, "Forbidden: Admins and Faculty only");
  }

  const announcement = await Announcement.create({
    heading,
    text,
    postedBy: req.user._id,
  });

  //  Send Email Notification
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    // Replace with your frontend announcement page URL
    const announcementLink = `${process.env.FRONTEND_URL}/announcements/${announcement._id}`;

    const mailOptions = {
      from: `"Career Services and IL Office" <${process.env.GMAIL}>`,
      to: "k213329@nu.edu.pk", // Add multiple emails separated by commas in .env
      subject: "New Announcement Posted",
      html: `<p><strong>${heading}</strong></p>
             <p>${text}</p>
             <p> Click <a href="${announcementLink}">here</a> to view the announcement.</p>
             <p style="font-size: medium; color: black;">
             <b>Best Regards,</b><br>
             Industrial Liaison/Career Services Office<br>
             021 111 128 128 ext. 184
             </p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }

  return res.status(201).json(new ApiResponse(201, announcement, "Announcement created successfully & email sent."));
});

export const getAnnouncements = asyncHandler(async (req, res) => {
  try {
    // Extract query parameters with default values
    const { page = 1, limit = 10, searchTerm = "" } = req.query;

    // Convert page & limit to integers for safety
    const parsedPage = Math.max(parseInt(page, 10), 1);
    const parsedLimit = Math.max(parseInt(limit, 10), 10);

    // Determine which announcements to fetch based on user role
    let query = {};
    if (req.user.role === "faculty") {
      query.postedBy = req.user.id; // Show only their own announcements
    }

    // Apply search filter
    if (searchTerm) {
      query.heading = { $regex: searchTerm, $options: "i" };
    }

    // Get total number of announcements matching query
    const total = await Announcement.countDocuments(query);

    // Fetch paginated announcements
    const announcements = await Announcement.find(query)
      .sort({ postedOn: -1 }) // Newest first
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .populate("postedBy", "fullName role");

    // Return paginated results
    return res.status(200).json({
      data: announcements,
      totalPages: parsedLimit > 0 ? Math.ceil(total / parsedLimit) : 1,
      currentPage: parsedPage,
      totalAnnouncements: total,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


/**
 * Fetch Announcement by ID
 */
export const getAnnouncementsById = asyncHandler(async (req, res) => {
  const { announcementId } = req.params;

  const announcement = await Announcement.findById(announcementId).populate("postedBy", "fullName role");
  if (!announcement) {
    throw new ApiError(404, "Announcement not found");
  }

  res.status(200).json(new ApiResponse(200, announcement, "Announcement fetched successfully"));
});
/**
 * Update an announcement (Admin & Faculty only)
 */
export const updateAnnouncement = asyncHandler(async (req, res) => {
  const { announcementId } = req.params;
  const { heading, text } = req.body;

  const announcement = await Announcement.findById(announcementId);
  if (!announcement) {
    throw new ApiError(404, "Announcement not found");
  }

  if (req.user.role !== "admin" && req.user._id.toString() !== announcement.postedBy.toString()) {
    throw new ApiError(403, "You can only update your own announcements");
  }

  announcement.heading = heading || announcement.heading;
  announcement.text = text || announcement.text;

  await announcement.save();

  return res.status(200).json(new ApiResponse(200, announcement, "Announcement updated successfully"));
});

/**
 * Delete an announcement (Admin only)
 */
export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const { announcementId } = req.params;

  const announcement = await Announcement.findById(announcementId);
  if (!announcement) {
    throw new ApiError(404, "Announcement not found");
  }

  //  Faculty can only delete their own posts
  if (req.user.role === "faculty" && announcement.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Forbidden: You can only delete your own news feeds.");
  }

  //  Admin can delete any newsFeed
  await announcement.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, "Announcement deleted successfully"));
});
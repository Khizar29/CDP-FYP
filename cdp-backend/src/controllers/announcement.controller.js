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
      to: "k213335@nu.edu.pk", // Add multiple emails separated by commas in .env
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
    const announcements = await Announcement.find().populate("postedBy", "fullName role");
  
    return res.status(200).json(new ApiResponse(200, announcements, "Announcements fetched successfully"));
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
  
    await announcement.deleteOne();
  
    return res.status(200).json(new ApiResponse(200, null, "Announcement deleted successfully"));
});
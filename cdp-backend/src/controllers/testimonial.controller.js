const  asyncHandler  = require('../utils/asyncHandler.js');
const  ApiError  = require('../utils/ApiError.js');
const  ApiResponse  = require('../utils/ApiResponse.js');
const Testimonial = require("../models/testimonial.model.js");
const { uploadFileToGoogleDrive, deleteLocalFile, getFilePublicUrl } = require('../utils/GoogleDrive.js');
const fs = require('fs');

// Admin-only function to create a testimonial
const createTestimonial = asyncHandler(async (req, res) => {

    const { name, message, title, isApproved } = req.body;
    const file = req.file; 

    if (!req.user || req.user.role !== 'admin') {
        throw new ApiError(403, 'Forbidden: Admins only');
    }

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

    const testimonial = new Testimonial({
        name,
        message,
        title,
        image: imageUrl,
        isApproved
    });

    await testimonial.save();
    res.status(201).json(new ApiResponse(201, testimonial, "Testimonial created successfully"));
});


// Admin-only function to update a testimonial
const updateTestimonial = asyncHandler(async (req, res) => {
    const { testimonialId } = req.params;
    const { name, message, title, isApproved } = req.body;
    const file = req.file;

    if (!req.user || req.user.role !== 'admin') {
        throw new ApiError(403, 'Forbidden: Admins only');
    }

    const testimonial = await Testimonial.findById(testimonialId);

    if (!testimonial) {
        throw new ApiError(404, 'Testimonial not found');
    }

    let imageUrl = testimonial.image;
    if (file) {
        // Upload the new image to Google Drive and get the public thumbnail URL
        const googleDriveFileId = await uploadFileToGoogleDrive(file);
        imageUrl = getFilePublicUrl(googleDriveFileId); 

        // Remove the file from local storage after uploading to Drive
        deleteLocalFile(file.path);
    }

    testimonial.name = name || testimonial.name;
    testimonial.message = message || testimonial.message;
    testimonial.title = title || testimonial.title;
    testimonial.image = imageUrl;
    testimonial.isApproved = isApproved !== undefined ? isApproved : testimonial.isApproved;
    testimonial.date = Date.now();

    await testimonial.save();

    return res.status(200).json(new ApiResponse(200, testimonial, 'Testimonial updated successfully'));
});

// Admin-only function to delete a testimonial
const deleteTestimonial = asyncHandler(async (req, res) => {
    const { testimonialId } = req.params;

    if (!req.user || req.user.role !== 'admin') {
        throw new ApiError(403, 'Forbidden: Admins only');
    }

    const testimonial = await Testimonial.findByIdAndDelete(testimonialId);

    if (!testimonial) {
        throw new ApiError(404, 'Testimonial not found');
    }

    return res.status(200).json(new ApiResponse(200, null, 'Testimonial deleted successfully'));
});

// Fetch a single testimonial by ID
const getTestimonialById = asyncHandler(async (req, res) => {
    const { testimonialId } = req.params;

    const testimonial = await Testimonial.findById(testimonialId);

    if (!testimonial) {
        throw new ApiError(404, 'Testimonial not found');
    }

    return res.status(200).json(new ApiResponse(200, testimonial, 'Testimonial fetched successfully'));
});

// Fetch all approved testimonials
const fetchTestimonials = asyncHandler(async (req, res) => {
    try {
        // Fetch only approved testimonials from the database
        const testimonials = await Testimonial.find({ isApproved: true });
        if (!testimonials || testimonials.length === 0) {
            return res.status(404).json(new ApiError(404, 'No approved testimonials found'));
        }
        return res.status(200).json(new ApiResponse(200, testimonials, 'Testimonials fetched successfully'));
    } catch (error) {
        return res.status(500).json(new ApiError(500, 'Failed to fetch testimonials', error.message));
    }
});

// Export functions using CommonJS syntax
module.exports = {
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getTestimonialById,
    fetchTestimonials,
};

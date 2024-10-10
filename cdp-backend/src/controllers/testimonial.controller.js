import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import testimonial from "../models/testimonial.model.js";
import Testimonial from "../models/testimonial.model.js";


//Admin only function
const createTestimonial = asyncHandler(async(req, res) => {
    const{ name, message, title} = req.body;

    if(!req.user || req.user.role !== 'admin'){
        throw new ApiError(403, 'Forbidden: Admins only');
    }

    const testimonial = new Testimonial ({
        name, 
        message, 
        title,
    })

    await testimonial.save();

    return res.status(201).json(new ApiResponse(201, testimonial, 'Testimonial created successfully'));

});

const updateTestimonial = asyncHandler(async( req, res)=>{
    const { testimonialId } = req.params;
    const { name, message, title} = req.body;

    if(!req.user || req.user.role !== 'admin'){
        throw new ApiError(403, 'Forbidden: Admins only');
    }

    const testimonial = await Testimonial.findById(testimonialId);

    if (!testimonial){
        throw new ApiError(404, 'Testimonial not found');
    }

    testimonial.name = name || testimonial.name;
    testimonial.message = message || testimonial.message;
    testimonial.title = title || testimonial.title;
    testimonial.date = Date.now();

    await testimonial.save();

    return res.status(200).json(new ApiResponse(200, testimonial, 'Testimonial updated successfully'));

});

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

const getTestimonialById = asyncHandler(async (req, res) => {
    const { testimonialId } = req.params;
  
    const testimonial = await Testimonial.findOne({ nuId });
  
    if (!graduate) {
      throw new ApiError(404, 'Testimonial not found');
    }
  
    return res.status(200).json(new ApiResponse(200, testimonial, 'Testimonial fetched successfully'));
});
  
// Fetch all Testimonials (without pagination)
const fetchTestimonials = asyncHandler(async (req, res) => {
    try {
      // Fetch all approved testimonials from the database
      const testimonials = await Testimonial.find({ isApproved: true }); // Fetch only approved testimonials
  
      return res.status(200).json({
        data: testimonials,
        totalTestimonials: testimonials.length, // Return total number of testimonials
      });
    } 
    catch (error) {
      //console.error('Error fetching testimonials:', error);
      return res.status(500).json(new ApiError(500, 'Failed to fetch testimonials', error.message));
    }
});

export {
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getTestimonialById,
    fetchTestimonials, 

}
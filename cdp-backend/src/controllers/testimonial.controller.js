import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Testimonial from "../models/testimonial.model.js";


//Admin only function
const createTestimonial = asyncHandler(async (req, res) => {
  const { name, message, title, isApproved } = req.body;

  console.log('Request Body isApproved:', isApproved); // Log incoming data

  if (!req.user || req.user.role !== 'admin') {
      throw new ApiError(403, 'Forbidden: Admins only');
  }

  const testimonial = new Testimonial({
      name,
      message,
      title,
      isApproved
  });

  await testimonial.save();

  return res.status(201).json(new ApiResponse(201, testimonial, 'Testimonial created successfully'));
});


const updateTestimonial = asyncHandler(async( req, res)=>{
    const { testimonialId } = req.params;
    const { name, message, title, isApproved} = req.body;

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
    testimonial.isApproved = isApproved !== undefined ? isApproved : testimonial.isApproved;
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
  
    const testimonial = await Testimonial.findById(testimonialId);
  
    if (!testimonial) {
      throw new ApiError(404, 'Testimonial not found');
    }
  
    return res.status(200).json(new ApiResponse(200, testimonial, 'Testimonial fetched successfully'));
});
  
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


export {
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getTestimonialById,
    fetchTestimonials, 

}
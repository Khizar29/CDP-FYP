import mongoose, { Schema } from "mongoose";

const testimonialSchema = new Schema(
    {
        //name of the person
        name: {
            type: String,
            required: true,
            trim: true,
        },
        //the message
        message: {
            type: String,
            required: true,
            trim: true,
        },
        //title/position of the person (eg: CEO/Dean/HoD)
        title: {
            type: String,
            required: false,
        },
        image: {
            type: String,
            required: false, 
        },
        date: {
            type: Date,
            default: Date.now, 
        },
        //this is to be verified
        //if the admin wants the sole control for testimonials then we have to remove this
        isApproved: {
            type: Boolean,
            default: false,
        },
    }, 
    {
        timestamps:true,

    }
      
)

const Testimonial = mongoose.model("testimonial", testimonialSchema);
export default Testimonial;
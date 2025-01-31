import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company_name: { 
      type: String,
      required: true,
      trim: true,
    },
    job_type: {
      type: String,
      enum: ["Onsite", "Remote", "Hybrid", "Internship"],
      required: true,
    },
    qualification_req: {
      type: String,
      required: true,
      trim: true,
    },
    job_description: {
      type: String,
      required: true,
      trim: true,
    },
    responsibilities: {
      type: String,
      required: true,
      trim: true,
    },
    job_link: { 
      type: String,
      required: false, 
      trim: true,
      validate: {
        validator: function (value) {
          // Allow valid URLs or email addresses
          return (
            /^((https?:\/\/)?[a-zA-Z0-9-_.]+\.[a-zA-Z]+(\/.*)?)$/.test(value) || 
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          );
        },
        message: "Invalid job link or email address",
      },
    },
    posted_on: {
      type: Date,
      default: Date.now,
    },
    updated_on: {
      type: Date,
    },
    postedBy: { 
      type: String, 
      required: true,
      trim: true 
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;

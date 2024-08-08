import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company_name: { // Added company_name field
      type: String,
      required: true,
      trim: true,
    },
    job_type: {
      type: String,
      enum: ["Onsite", "Remote", "Hybrid", "Internship"],
      required: true,
    },
    no_of_openings: {
      type: Number,
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
    posted_on: {
      type: Date,
      default: Date.now,
    },
    updated_on: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;

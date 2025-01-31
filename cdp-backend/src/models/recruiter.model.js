import mongoose, { Schema } from "mongoose";

const recruiterSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    companyPhone: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false, // Default to false until admin approval
    },
    verificationRequestedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: {
      type: Date, // Set when the admin verifies the recruiter
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.model("Recruiter", recruiterSchema);

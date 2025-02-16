import mongoose, { Schema } from "mongoose";

const graduateSchema = new Schema(
  {
    nuId: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Ensuring nuId is unique
    },
    fullName: {  // ✅ Replacing firstName & lastName with fullName
      type: String,
      required: true,
      trim: true,
    },
    nuEmail: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Ensuring nuEmail is unique
    },
    personalEmail: {
      type: String,
      required: false,
      trim: true,
    },
    discipline: {
      type: String,
      required: true,
      trim: true,
    },
    yearOfGraduation: {
      type: Number,
      required: true,
    },
    cgpa: {
      type: Number,
      required: true,
    },
    profilePic: {
      type: String,
      required: false,
    },
    contact: {
      type: String,
      required: false,
      trim: true,
    },
    tagline: {
      type: String,
      required: false,
      trim: true,
    },
    personalExperience: {
      type: String,
      required: false,
      trim: true,
    },
    certificate: {
      type: String,
      required: false,
      trim: true,
    },
    fyp: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Graduate = mongoose.model("Graduate", graduateSchema);

export default Graduate;

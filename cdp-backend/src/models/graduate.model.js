const mongoose = require("mongoose");
const { Schema } = mongoose;

const graduateSchema = new Schema(
  {
    nuId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    nuEmail: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    personalEmail: {
      type: String,
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
    skills: {
      type: [String], // ✅ Added skills as an array of strings
      default: [],
    },
    profilePic: {
      type: String,
    },
    contact: {
      type: String,
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    personalExperience: {
      type: String,
      trim: true,
    },
    certificate: {
      type: String,
      trim: true,
    },
    fyp: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Graduate = mongoose.model("Graduate", graduateSchema);
module.exports = Graduate;

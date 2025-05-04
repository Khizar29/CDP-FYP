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
      required: false,
      trim: true,
    },
    yearOfGraduation: {
      type: Number,
      required: false,
    },
    cgpa: {
      type: Number,
      required: false,
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: function(skills) {
          return skills.every(skill => typeof skill === 'string' && skill.trim().length > 0);
        },
        message: 'Each skill must be a non-empty string'
      }
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
    isGraduate: { //only for validation purpose
      type: Boolean, 
      default: true 
    },
    graduationDate: {
      type: Date,
    }
    
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Graduate = mongoose.model("Graduate", graduateSchema);
module.exports = Graduate;

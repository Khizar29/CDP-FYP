const mongoose = require("mongoose");
const { Schema } = mongoose;

const facultySchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    nuEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true, // Ensures unique faculty email
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false, // Faculty verification required by admin
    },
    verificationRequestedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: {
      type: Date, // Timestamp when verified
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Faculty", facultySchema);

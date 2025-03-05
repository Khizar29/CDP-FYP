// src/models/user.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'recruiter', 'faculty'], // Added 'recruiter', Added 'faculty'
      default: 'user',
    },
    nuId: {
      type: String,
      required: function() {
        return this.role === 'user'; // Required only for graduates
      },
      unique: true,
      sparse: true, // Allows null values for recruiters and admins
    },
  },
  {
    timestamps: true,
  }
);

// Password encryption logic remains the same
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
      role: this.role,
      nuId: this.nuId, // Include nuId in the token for easier access
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

module.exports = mongoose.model("User", userSchema);

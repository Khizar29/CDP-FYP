const mongoose = require("mongoose");
const { Schema } = mongoose;

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
      required: false,
      trim: true,
    },
    job_description: {
      type: String,
      required: false,
      trim: true,
    },
    responsibilities: {
      type: String,
      required: false,
      trim: true,
    },
    application_methods: [{
      type: {
        type: String,
        enum: ["email", "website", "form"],
        required: true
      },
      value: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            if (this.type === "email") {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            }
            return /^https?:\/\/.+\..+/.test(v);
          },
          message: props => `Invalid ${props.type} format`
        }
      },
      instructions: String
    }],
    posted_on: {
      type: Date,
      default: Date.now,
    },
    updated_on: {
      type: Date,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    // New field to store the number of applications for this job
    applicationCount: {
      type: Number,
      default: 0,
    },

    job_niche: {
      type: String,
      trim: true,
      default: "Others"
    }

  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Job", jobSchema);

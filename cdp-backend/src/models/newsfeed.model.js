import mongoose, { Schema } from 'mongoose';

const newsFeedSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: false, // Optional field for the image path
    },
    category: {
      type: String,
      enum: ['announcement', 'event', 'news', 'other'], // Define possible categories
      default: 'news', // Set a default category if none is specified
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isPublic: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const NewsFeed = mongoose.model('NewsFeed', newsFeedSchema);

export default NewsFeed;

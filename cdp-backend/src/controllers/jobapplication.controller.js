const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Application = require("../models/jobapplication.model");
const Job = require("../models/job.model");

/**
 * @desc Track job application (Apply Now click)
 * @route POST /api/applications/track
 * @access Private (Authenticated Users)
 */
const trackApplication = asyncHandler(async (req, res) => {
  const { jobId } = req.body;
  const userId = req.user._id;

  if (!jobId) throw new ApiError(400, "Job ID is required");

  try {
    await Application.create({ userId, jobId });
    return res.status(201).json({ message: "Application tracked successfully" });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(400, "Already applied");
    }
    throw new ApiError(500, "Error tracking application");
  }
});

/**
 * @desc Get trending job niches
 * @route GET /api/applications/trending-niches
 * @access Private (Admin Only)
 */
// const getTrendingJobNiches = asyncHandler(async (req, res) => {
//   const trending = await Application.aggregate([
//     { $lookup: { from: "jobs", localField: "jobId", foreignField: "_id", as: "job" } },
//     { $unwind: "$job" },
//     { $group: { _id: "$job.category", count: { $sum: 1 } } },
//     { $sort: { count: -1 } },
//     { $limit: 5 }
//   ]);

//   return res.json(trending);
// });

/**
 * @desc Get most sought-after jobs
 * @route GET /api/applications/most-sought
 * @access Private (Admin Only)
 */
const getMostSoughtJobs = asyncHandler(async (req, res) => {
  const mostSought = await Application.aggregate([
    { $group: { _id: "$jobId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $lookup: { from: "jobs", localField: "_id", foreignField: "_id", as: "job" } },
    { $unwind: "$job" },
    { $project: { _id: "$job._id", title: "$job.title", company: "$job.company_name", count: 1 } }
  ]);

  return res.json(mostSought);
});

/**
 * @desc Get monthly breakdown of applications
 * @route GET /api/applications/monthly-breakdown
 * @access Private (Admin Only)
 */
const getMonthlyApplications = asyncHandler(async (req, res) => {
  const monthlyData = await Application.aggregate([
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  return res.json(monthlyData);
});

module.exports = {
  trackApplication,
  getMostSoughtJobs,
  getMonthlyApplications
};

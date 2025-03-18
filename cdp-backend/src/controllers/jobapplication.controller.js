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
    // Create the job application
    await Application.create({ userId, jobId });

    // ✅ Update job's application count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

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
        _id: { 
          year: { $year: "$createdAt" }, 
          month: { $month: "$createdAt" } 
        },
        totalApplications: { $sum: 1 } // Count applications
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } } // Sort by year & month
  ]);

  // Convert month numbers to names (optional)
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const formattedData = monthlyData.map((data) => ({
    year: data._id.year,
    month: months[data._id.month - 1], // Convert number to name
    totalApplications: data.totalApplications
  }));

  return res.json(formattedData);
});


/**
 * @desc Get job applications count per job
 * @route GET /api/applications/count-per-job
 * @access Private (Admin Only)
 */
const getJobApplicationsCount = asyncHandler(async (req, res) => {
  const jobApplications = await Application.aggregate([
    {
      $group: {
        _id: "$jobId", // Group by jobId
        count: { $sum: 1 }, // Count number of applications
      },
    },
    {
      $lookup: {
        from: "jobs", // Join with Jobs collection
        localField: "_id",
        foreignField: "_id",
        as: "jobDetails",
      },
    },
    { $unwind: "$jobDetails" }, // Flatten the job details array
    {
      $project: {
        _id: 0,
        jobId: "$_id",
        title: "$jobDetails.title",
        company: "$jobDetails.company_name",
        job_type: "$jobDetails.job_type",
        applicationCount: "$count",
      },
    },
  ]);

  return res.status(200).json(jobApplications);
});

module.exports = {
  trackApplication,
  getMostSoughtJobs,
  getMonthlyApplications,
  getJobApplicationsCount, // Add new function to exports
};

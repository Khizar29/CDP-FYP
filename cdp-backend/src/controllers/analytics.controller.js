
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Application = require("../models/jobapplication.model");
const ApiResponse = require("../utils/ApiResponse");
const Job = require("../models/job.model");

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


const getMostSoughtJobs = asyncHandler(async (req, res) => {
    const mostSought = await Application.aggregate([
        { $group: { _id: "$jobId", applicationCount: { $sum: 1 } } }, // Rename count to applicationCount
        { $sort: { applicationCount: -1 } },
        { $limit: 5 },
        { $lookup: { from: "jobs", localField: "_id", foreignField: "_id", as: "job" } },
        { $unwind: "$job" },
        { $project: { _id: "$job._id", title: "$job.title", company: "$job.company_name", applicationCount: 1 } } // Rename count to applicationCount
    ]);

    return res.json(mostSought);
});


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

const getApplicationsPerJobType = asyncHandler(async (req, res) => {
    try {
        const applicationsPerJobType = await Application.aggregate([
            {
                $lookup: {
                    from: "jobs", // Join with the Job collection
                    localField: "jobId",
                    foreignField: "_id",
                    as: "jobDetails",
                },
            },
            { $unwind: "$jobDetails" }, // Flatten the job details
            {
                $group: {
                    _id: "$jobDetails.job_type", // Group by job type
                    totalApplications: { $sum: 1 }, // Count applications per job type
                },
            },
            {
                $project: {
                    _id: 0,
                    jobType: "$_id", // Rename _id to jobType
                    totalApplications: 1,
                },
            },
            { $sort: { totalApplications: -1 } }, // Sort by totalApplications in descending order
        ]);

        return res.status(200).json(applicationsPerJobType);
    } catch (error) {
        console.error("Error fetching applications per job type:", error);
        throw new ApiError(500, "Failed to fetch applications per job type");
    }
});

const getJobPostingsByQualification = asyncHandler(async (req, res) => {
    try {
        const jobPostingsByQualification = await Job.aggregate([
            {
                $group: {
                    _id: "$qualification_req", // Group by qualification requirements
                    totalJobs: { $sum: 1 }, // Count the number of jobs per qualification
                },
            },
            {
                $project: {
                    _id: 0,
                    qualification: "$_id", // Rename _id to qualification
                    totalJobs: 1,
                },
            },
            { $sort: { totalJobs: -1 } }, // Sort by totalJobs in descending order
        ]);

        return res.status(200).json(jobPostingsByQualification);
    } catch (error) {
        console.error("Error fetching job postings by qualification:", error);
        throw new ApiError(500, "Failed to fetch job postings by qualification");
    }
});

const getJobPostingsVsApplicationsOverTime = asyncHandler(async (req, res) => {
    try {
        const jobPostingsOverTime = await Job.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$posted_on" }, // Group by year and month
                        month: { $month: "$posted_on" },
                    },
                    totalJobs: { $sum: 1 }, // Count the number of jobs per month
                },
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    totalJobs: 1,
                },
            },
            { $sort: { year: 1, month: 1 } }, // Sort by year and month
        ]);

        const applicationsOverTime = await Application.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" }, // Group by year and month
                        month: { $month: "$createdAt" },
                    },
                    totalApplications: { $sum: 1 }, // Count the number of applications per month
                },
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    totalApplications: 1,
                },
            },
            { $sort: { year: 1, month: 1 } }, // Sort by year and month
        ]);

        // Combine the data into a single array
        const combinedData = jobPostingsOverTime.map((jobPosting) => {
            const matchingApplication = applicationsOverTime.find(
                (application) =>
                    application.year === jobPosting.year && application.month === jobPosting.month
            );

            const monthNames = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
              ];

            return {
                year: jobPosting.year,
                month: monthNames[jobPosting.month - 1], // Convert month number to month name
                totalJobs: jobPosting.totalJobs,
                totalApplications: matchingApplication ? matchingApplication.totalApplications : 0,
            };
        });

        return res.status(200).json(combinedData);
    } catch (error) {
        console.error("Error fetching job postings vs applications over time:", error);
        throw new ApiError(500, "Failed to fetch job postings vs applications over time");
    }
});

const getAllJobsApplicationPerCompany = asyncHandler(async (req, res) => {
    const applicationsPerCompany = await Job.aggregate([
        {
            $group: {
                _id: "$company_name", // Group by company name
                totalApplications: { $sum: "$applicationCount" }, // Sum applicationCount for each company
            },
        },
        { $sort: { totalApplications: -1 } }, // Sort by totalApplications in descending order
        {
            $project: {
                _id: 0,
                company: "$_id", // Rename _id to company
                totalApplications: 1,
            },
        },
    ]);

    return res.status(200).json(applicationsPerCompany);
});


//JOB POSITNGS

const getJobsPostedPerMonth = asyncHandler(async (req, res) => {
    try {
        const jobsPerMonth = await Job.aggregate([
            {
                $match: { status: "approved" }, // Only count approved jobs
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$posted_on" },
                        month: { $month: "$posted_on" },
                    },
                    totalJobs: { $sum: 1 },
                },
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                },
            },
        ]);

        return res.status(200).json(new ApiResponse(200, jobsPerMonth, "Jobs posted per month"));
    } catch (error) {
        console.error("Error fetching jobs per month:", error);
        return res.status(500).json(new ApiError(500, "Failed to fetch job posting data"));
    }
});

const getSortedJobsByApplicationCount = asyncHandler(async (req, res) => {
    try {
      const sortedJobs = await Application.aggregate([
        {
          $group: {
            _id: "$jobId",
            applicationCount: { $sum: 1 }
          }
        },
        {
          $sort: { applicationCount: -1 } // Sort in descending order
        },
        {
          $lookup: {
            from: "jobs", // Reference Job collection
            localField: "_id",
            foreignField: "_id",
            as: "jobDetails"
          }
        },
        {
          $unwind: "$jobDetails"
        },
        {
          $project: {
            _id: "$jobDetails._id",
            title: "$jobDetails.title",
            company_name: "$jobDetails.company_name",
            applicationCount: 1
          }
        }
      ]);
  
      return res.status(200).json(sortedJobs);
    } catch (error) {
      console.error("Error sorting jobs by application count:", error);
      throw new ApiError(500, "Failed to retrieve sorted jobs");
    }
  });
  

const getJobPostingsByRecruiter = asyncHandler(async (req, res) => {
    try {
        const jobPostingsByRecruiter = await Job.aggregate([
            {
                $group: {
                    _id: "$postedBy", // Group by recruiter (postedBy field)
                    totalJobs: { $sum: 1 }, // Count the number of jobs per recruiter
                },
            },
            {
                $lookup: {
                    from: "users", // Join with the User collection
                    localField: "_id",
                    foreignField: "_id",
                    as: "recruiterDetails",
                },
            },
            { $unwind: "$recruiterDetails" }, // Flatten the recruiter details
            {
                $project: {
                    _id: 0,
                    recruiterId: "$_id",
                    recruiterName: "$recruiterDetails.fullName", // Include recruiter name
                    totalJobs: 1,
                },
            },
            { $sort: { totalJobs: -1 } }, // Sort by totalJobs in descending order
        ]);

        return res.status(200).json(jobPostingsByRecruiter);
    } catch (error) {
        console.error("Error fetching job postings by recruiter:", error);
        throw new ApiError(500, "Failed to fetch job postings by recruiter");
    }
});

const getJobCountByNiche = asyncHandler(async (req, res) => {
  try {
    const result = await Job.aggregate([
      {
        $match: { status: "approved" } // Optional: only count approved jobs
      },
      {
        $group: {
          _id: "$job_niche",
          totalJobs: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          niche: "$_id",
          totalJobs: 1
        }
      },
      { $sort: { totalJobs: -1 } },
      
    ]);
    console.log("job niche")
    return res.status(200).json(new ApiResponse(200, result, "Job count by niche"));
  } catch (error) {
    console.error("Error in getJobCountByNiche:", error);
    return res.status(500).json(new ApiError(500, "Failed to fetch job niche counts"));
  }
});

module.exports = {

    getMostSoughtJobs,
    getMonthlyApplications,
    getJobApplicationsCount,
    getApplicationsPerJobType,
    getJobPostingsByQualification,
    getJobPostingsVsApplicationsOverTime,
    getAllJobsApplicationPerCompany,
    getSortedJobsByApplicationCount,
    getJobsPostedPerMonth,
    getJobPostingsByRecruiter,
    getJobCountByNiche,

};

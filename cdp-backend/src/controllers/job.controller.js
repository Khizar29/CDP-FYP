const Job = require('../models/job.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const nodemailer = require('nodemailer');
const Application = require("../models/jobapplication.model");


const createJob = asyncHandler(async (req, res) => {
  let {
    title,
    company_name,
    job_type,
    qualification_req,
    job_description,
    responsibilities,
    application_methods,
    toEmails,
    ccEmails,
    bccEmails
  } = req.body;

  if (!req.user || !['admin', 'recruiter'].includes(req.user.role)) {
    throw new ApiError(403, "Forbidden: Admins and Recruiters only");
  }

  const status = req.user.role === "admin" ? "approved" : "pending";

  // Normalize email arrays
  toEmails = Array.isArray(toEmails) ? toEmails : (toEmails ? [toEmails] : []);
  ccEmails = Array.isArray(ccEmails) ? ccEmails : (ccEmails ? [ccEmails] : []);
  bccEmails = Array.isArray(bccEmails) ? bccEmails : (bccEmails ? [bccEmails] : []);

  // Validate and normalize application methods
  application_methods = Array.isArray(application_methods)
    ? application_methods.map(method => ({
      type: ['email', 'website', 'form'].includes(method.type) ? method.type : 'website',
      value: method.value || '',
      instructions: method.instructions || ''
    }))
    : [];

  // Create job with all fields
  const job = new Job({
    title,
    company_name,
    job_type,
    qualification_req,
    job_description,
    responsibilities,
    application_methods,
    postedBy: req.user.id,
    status
  });

  await job.save();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  // Email sending logic for approved jobs
  if (status === "approved") {
    // Only use toEmails field for recipients
    const allRecipients = [...new Set(toEmails)];

    if (allRecipients.length > 0) {
      const subject = `Exciting Career Opportunity: ${title}`;

      // Generate application links HTML
      const applicationLinks = application_methods.map(method => {
        if (method.type === 'email') {
          return `<li>Email: <a href="mailto:${method.value}${method.instructions ? `?subject=${encodeURIComponent(method.instructions)}` : ''}">${method.value}</a>${method.instructions ? ` (${method.instructions})` : ''}</li>`;
        }
        return `<li>Website: <a href="${method.value}">${method.value}</a></li>`;
      }).join('');

      const html = `
        <p>Dear Students,</p>
        <p>We are excited to share an excellent career opportunity with you:</p>
        <h3>${title} at ${company_name}</h3>
        <p><strong>Job Type:</strong> ${job_type}</p>
        ${job_description ? `<div>${job_description}</div>` : ''}
        
        ${qualification_req ? `<h4>Qualifications:</h4><div>${qualification_req}</div>` : ''}
        ${responsibilities ? `<h4>Responsibilities:</h4><div>${responsibilities}</div>` : ''}

        <h4>How to Apply:</h4>
        <ul>${applicationLinks}</ul>
        
        <p style="font-size: medium; color: black;">
        <b>Best Regards,</b><br>
        Industrial Liaison/Career Services Office<br>
        021 111 128 128 ext. 184
      `;

      try {
        await transporter.sendMail({
          from: `"Career Services and IL Office Karachi" <${process.env.GMAIL}>`,
          to: allRecipients.join(","),
          cc: ccEmails.length ? ccEmails.join(",") : undefined,
          bcc: bccEmails.length ? bccEmails.join(",") : undefined,
          subject,
          html,
        });
      } catch (emailError) {
        console.error("📧 Email Error:", emailError);
      }
    }
  }

  // Admin notification for pending jobs
  if (status === "pending") {
    const adminEmail = "s.khizarali03@gmail.com";
    try {
      await transporter.sendMail({
        from: `"Job Approval System" <${process.env.GMAIL}>`,
        to: adminEmail,
        subject: `New Job Pending Approval: ${title}`,
        html: `
          <p>Hello Admin,</p>
          <p>A new job posting requires your approval:</p>
          <h3>${title} at ${company_name}</h3>
          <p><strong>Application Methods:</strong></p>
          <ul>
            ${application_methods.map(m => `<li>${m.type}: ${m.value}${m.instructions ? ` (${m.instructions})` : ''}</li>`).join('')}
          </ul>
          <p>Please review in the admin dashboard.</p>
        `
      });
    } catch (emailError) {
      console.error("📧 Admin Email Error:", emailError);
    }
  }

  return res.status(201).json(new ApiResponse(201, job, "Job posted successfully"));
});

const updateJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const {
    title,
    company_name,
    job_type,
    qualification_req,
    job_description,
    responsibilities,
    application_methods
  } = req.body;

  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admins only');
  }

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, 'Job not found');

  // Update all fields
  job.title = title || job.title;
  job.company_name = company_name || job.company_name;
  job.job_type = job_type || job.job_type;
  job.qualification_req = qualification_req || job.qualification_req;
  job.job_description = job_description || job.job_description;
  job.responsibilities = responsibilities || job.responsibilities;

  // Update application methods if provided
  if (Array.isArray(application_methods)) {
    job.application_methods = application_methods.map(method => ({
      type: ['email', 'website', 'form'].includes(method.type) ? method.type : 'website',
      value: method.value || '',
      instructions: method.instructions || ''
    }));
  }

  job.updated_on = Date.now();
  await job.save();

  return res.status(200).json(new ApiResponse(200, job, 'Job updated successfully'));
});



// Delete a job (Admin only)
const deleteJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admins only');
  }

  const job = await Job.findByIdAndDelete(jobId);

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  return res.status(200).json(new ApiResponse(200, null, 'Job deleted successfully'));
});

// Fetch all jobs with filters
const getAllJobs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, searchTerm = '', filterDate = '', filterStatus = '' } = req.query;

  const query = {};

  if (!req.user) {
    throw new ApiError(403, 'Forbidden: Please login');
  }
  // Search query
  if (searchTerm) {
    query.$or = [
      { company_name: { $regex: searchTerm, $options: 'i' } },
      { title: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  // Date filter
  if (filterDate) {
    const start = new Date(filterDate);
    const end = new Date(filterDate);
    end.setDate(end.getDate() + 1);
    query.posted_on = { $gte: start, $lt: end };
  }

  // Status filter (ignore if "all" is selected)
  if (filterStatus && filterStatus !== "all") {
    query.status = filterStatus;
  }

  // Convert page & limit to numbers
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  // Get total count
  const total = await Job.countDocuments(query);

  // Fetch jobs with pagination & sorting
  const jobs = await Job.find(query)
    .sort({ posted_on: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .populate('postedBy', 'email');

  return res.status(200).json({
    data: jobs,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
    totalJobs: total,
  });
});

// Fetch a single job by ID
const getJobById = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  return res.status(200).json(new ApiResponse(200, job, 'Job fetched successfully'));
});

// Get job count
const getJobCount = asyncHandler(async (req, res) => {
  try {
    const count = await Job.countDocuments();
    return res.status(200).json(new ApiResponse(200, { count }, 'Job count retrieved successfully'));
  } catch (error) {
    return res.status(500).json(new ApiError(500, 'Error counting jobs', error.message));
  }
});

const getRecruiterJobs = asyncHandler(async (req, res) => {
  try {
    // Ensure only recruiters can access their own jobs
    if (!req.user || req.user.role !== "recruiter") {
      console.error("Error: Unauthorized recruiter access");
      return res.status(403).json({ message: "Forbidden: Recruiters only" });
    }

    const { page = 1, limit = 10, searchTerm = "", filterDate = "" } = req.query;

    // Ensure the query fetches only jobs posted by the recruiter
    const query = { postedBy: req.user.id };

    //  Apply Search Query
    if (searchTerm) {
      query.$or = [
        { company_name: { $regex: searchTerm, $options: "i" } },
        { title: { $regex: searchTerm, $options: "i" } },
      ];
    }

    //  Apply Date Filter
    if (filterDate) {
      const start = new Date(filterDate);
      const end = new Date(filterDate);
      end.setDate(end.getDate() + 1);
      query.posted_on = { $gte: start, $lt: end };
    }

    //  Get total number of jobs
    const total = await Job.countDocuments(query);

    //  Apply Pagination and Sorting
    const startIndex = (page - 1) * limit;
    const jobs = await Job.find(query)
      .sort({ posted_on: -1 }) // Newest jobs first
      .skip(startIndex)
      .limit(parseInt(limit))
      .populate("postedBy", "fullName email");

    return res.status(200).json({
      data: jobs,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
      currentPage: page,
      totalJobs: total,
    });
  } catch (error) {
    console.error("Server Error in getRecruiterJobs:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});
const approveJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { status } = req.body; // Can be 'approved' or 'rejected'

  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Forbidden: Admins only");
  }

  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, "Job not found");

  job.status = status;
  job.updated_on = Date.now();
  await job.save();

  return res.status(200).json(new ApiResponse(200, job, `Job has been ${status}`));
});

// Export functions
module.exports = {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getJobCount,
  getRecruiterJobs,
  approveJob,
};

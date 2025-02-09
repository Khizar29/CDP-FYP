import Job from '../models/job.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import nodemailer from 'nodemailer';

const createJob = asyncHandler(async (req, res) => {
  let { 
    title, 
    company_name, 
    job_type,  
    qualification_req, 
    job_description, 
    responsibilities, 
    job_link,
    toEmails, 
    ccEmails, 
    bccEmails
  } = req.body;

  if (!req.user || !['admin', 'recruiter'].includes(req.user.role)) {
    throw new ApiError(403, "Forbidden: Admins and Recruiters only");
  }

  //  Determine job status based on user role
  const status = req.user.role === "admin" ? "approved" : "pending";

  //  Ensure email fields are arrays or empty
  toEmails = Array.isArray(toEmails) ? toEmails : (toEmails ? [toEmails] : []);
  ccEmails = Array.isArray(ccEmails) ? ccEmails : (ccEmails ? [ccEmails] : []);
  bccEmails = Array.isArray(bccEmails) ? bccEmails : (bccEmails ? [bccEmails] : []);

  const job = new Job({
    title,
    company_name, 
    job_type,
    qualification_req,
    job_description,
    responsibilities,
    job_link,
    postedBy: req.user.id,
    status 
  });

  await job.save();

  //  Setup email transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL, 
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  //  If admin posts a job AND `toEmails` exists, send to students
  if (status === "approved" && toEmails.length > 0) {
    const subject = `Exciting Career Opportunity: ${title}`;
    const html = `
      <p>Dear Students,</p>
      <p>We are excited to share an excellent career opportunity with you. Below are the details:</p>
      <h3>Company: ${company_name}</h3>
      <h3>Job Title: ${title}</h3>
      <h3>Job Type: ${job_type}</h3>
      <p>${job_description}</p>
      <h3>Qualifications</h3>
      <p>${qualification_req}</p>
      <h3>Responsibilities</h3>
      <p>${responsibilities}</p>
      <p>Apply here: <a href="${job_link}">${job_link}</a></p>
      <p>Best Regards, Career Services</p>
    `;

    try {
      await transporter.sendMail({
        from: `"Career Services" <${process.env.GMAIL}>`,
        to: toEmails.join(","), 
        cc: ccEmails.length ? ccEmails.join(",") : undefined,
        bcc: bccEmails.length ? bccEmails.join(",") : undefined,
        subject,
        html,
      });

      return res.status(201).json(new ApiResponse(201, job, "Job created successfully and emails sent"));
    } catch (emailError) {
      console.error("📧 Email Error:", emailError);
      return res.status(201).json(new ApiResponse(201, job, "Job created successfully but email failed to send"));
    }
  }

  //  Only send approval email if a **recruiter** posted the job (status === "pending")
  if (status === "pending") {
    const adminEmail = "s.khizarali03@gmail.com";
    const adminSubject = `New Job Pending Approval: ${title}`;
    const adminHtml = `
      <p>Hello Admin,</p>
      <p>A recruiter has posted a job that requires your approval:</p>
      <h3>Company: ${company_name}</h3>
      <h3>Job Title: ${title}</h3>
      <h3>Job Type: ${job_type}</h3>
      <p>${job_description}</p>
      <p>Please review and approve the job in the admin dashboard.</p>
      <p>Best Regards, System</p>
    `;

    try {
      await transporter.sendMail({
        from: `"Job Approval System" <${process.env.GMAIL}>`,
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml,
      });
    } catch (emailError) {
      console.error("📧 Admin Email Error:", emailError);
    }
  }

  return res.status(201).json(new ApiResponse(201, job, "Job posted successfully"));
});



// Update a job (Admin only)
const updateJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { title, company_name, job_type, no_of_openings, qualification_req, job_description, responsibilities, job_link } = req.body;

  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admins only');
  }

  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  job.title = title || job.title;
  job.company_name = company_name || job.company_name; 
  job.job_type = job_type || job.job_type;
  job.no_of_openings = no_of_openings || job.no_of_openings;
  job.qualification_req = qualification_req || job.qualification_req;
  job.job_description = job_description || job.job_description;
  job.responsibilities = responsibilities || job.responsibilities;
  job.job_link = job_link || job.job_link;
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

const getAllJobs = asyncHandler(async (req, res) => {

  if (!req.user) {
    throw new ApiError(401, 'Unauthorized request');
  }

  const { page = 1, limit = 10, searchTerm = '', filterDate = '' } = req.query;

  const query = {};

  // Build search query
  if (searchTerm) {
    query.$or = [
      { company_name: { $regex: searchTerm, $options: 'i' } },
      { title: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  // Add date filter
  if (filterDate) {
    const start = new Date(filterDate);
    const end = new Date(filterDate);
    end.setDate(end.getDate() + 1);
    query.posted_on = { $gte: start, $lt: end };
  }

  const total = await Job.countDocuments(query);
  
  const startIndex = (page - 1) * limit;
  const jobs = await Job.find(query)
    .sort({ posted_on: -1 }) // Sort by posted_on in descending order
    .skip(startIndex)
    .limit(parseInt(limit));

  return res.status(200).json({
    data: jobs,
    totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
    currentPage: page,
    totalJobs: total,
  });
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

// Fetch a single job by ID
const getJobById = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, 'Job not found');
  }

  return res.status(200).json(new ApiResponse(200, job, 'Job fetched successfully'));
});


const getJobCount = async (req, res) => {
  try {
    const count = await Job.countDocuments(); // Count the documents in the Job collection
    return res.status(200).json(new ApiResponse(200, { count }, 'Job count retrieved successfully'));
  } catch (error) {
    console.error('Error counting jobs:', error);
    return res.status(500).json(new ApiError(500, 'Error counting jobs', error.message));
  }
};

export {
  createJob,
  updateJob,
  deleteJob,
  approveJob,
  getAllJobs,
  getJobById,
  getJobCount,
  getRecruiterJobs
};

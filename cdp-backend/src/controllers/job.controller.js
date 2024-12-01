import Job from '../models/job.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import nodemailer from 'nodemailer';


const createJob = asyncHandler(async (req, res) => {
  const { 
    title, 
    company_name, 
    job_type, 
    no_of_openings, 
    qualification_req, 
    job_description, 
    responsibilities, 
    job_link 
  } = req.body;

  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Admins only');
  }

  const job = new Job({
    title,
    company_name, 
    job_type,
    no_of_openings,
    qualification_req,
    job_description,
    responsibilities,
    job_link,
  });

  await job.save();

  // // Fetch all students' emails
  // const students = await Student.find({}, 'email'); // Assuming 'email' is a field in Student
  // const studentEmails = students.map(student => student.email);

  // Set up nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service provider
    auth: {
      user: process.env.GMAIL, // Your email
      pass: process.env.GMAIL_PASSWORD, // Your email password
    },
  });

  // Email content
  // Email content as plain text
  // Email content as HTML
const subject = `Job Opportunity: ${title}`;
const html = `
<p>Dear Students,</p>

<p>Job Opportunity at <b>${company_name}</b>.</p>

<p><b>Title:</b> ${title}</p>
<p><b>Job Type:</b> ${job_type}</p>

<h3>Qualifications:</h3>
<p>${qualification_req}</p>

<h3>Job Description:</h3>
<p>${job_description}</p>

<h3>Responsibilities:</h3>
<p>${responsibilities}</p>
<br><br>
<p><b>You can apply here:</b> <a href="${job_link}">${job_link}</a></p>

<p>Best regards,</p>
<p>Your Career Development Team</p>
`;

  // Send email to all students
  await transporter.sendMail({
    from: process.env.GMAIL, // Sender address
    to: "k213335@nu.edu.pk", // List of recipients
    subject: subject, // Subject line
    html: html, // Plain text body
  });

  return res.status(201).json(new ApiResponse(201, job, 'Job created successfully and emails sent'));
});

// Create a new job (Admin only)
// const createJob = asyncHandler(async (req, res) => {
//   const { title, company_name, job_type, no_of_openings, qualification_req, job_description, responsibilities, job_link } = req.body;

//   if (!req.user || req.user.role !== 'admin') {
//     throw new ApiError(403, 'Forbidden: Admins only');
//   }

//   const job = new Job({
//     title,
//     company_name, 
//     job_type,
//     no_of_openings,
//     qualification_req,
//     job_description,
//     responsibilities,
//     job_link,
//   });

//   await job.save();

//   return res.status(201).json(new ApiResponse(201, job, 'Job created successfully'));
// });

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
  getAllJobs,
  getJobById,
  getJobCount
};

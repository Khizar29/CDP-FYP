const Job = require('../models/job.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const nodemailer = require('nodemailer');
const { Groq } = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const fs = require('fs');
const path = require('path');
const Application = require("../models/jobapplication.model"); 
const axios = require('axios');
// const { classifyJobNiche } = require("../utils/nicheClassifier");


const createJob = asyncHandler(async (req, res) => {
  let {
    title,
    company_name,
    job_type,
    qualification_req,
    job_description,
    responsibilities,
    application_methods,
    job_niche,
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
  status,
  job_niche // <-- add this
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

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  // Email sending logic for approved jobs
  if (job.status === "approved") {
    // Only use toEmails field for recipients
    // const allRecipients = [...new Set(toEmails)];

    // if (allRecipients.length > 0) {
      const subject = `Exciting Career Opportunity: ${job.title}`;

      // Generate application links HTML
      const applicationLinks = job.application_methods.map(method => {
        if (method.type === 'email') {
          return `<li>Email: <a href="mailto:${method.value}${method.instructions ? `?subject=${encodeURIComponent(method.instructions)}` : ''}">${method.value}</a>${method.instructions ? ` (${method.instructions})` : ''}</li>`;
        }
        return `<li>Website: <a href="${method.value}">${method.value}</a></li>`;
      }).join('');

      const html = `
        <p>Dear Students,</p>
        <p>We are excited to share an excellent career opportunity with you:</p>
        <h3>${job.title} at ${job.company_name}</h3>
        <p><strong>Job Type:</strong> ${job.job_type}</p>
        ${job.job_description ? `<div>${job.job_description}</div>` : ''}
        
        ${job.qualification_req ? `<h4>Qualifications:</h4><div>${job.qualification_req}</div>` : ''}
        ${job.responsibilities ? `<h4>Responsibilities:</h4><div>${job.responsibilities}</div>` : ''}

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
          to: "allstudents.khi@nu.edu.pk",
          cc: job.postedBy.email,
          // cc: ccEmails.length ? ccEmails.join(",") : undefined,
          // bcc: bccEmails.length ? bccEmails.join(",") : undefined,
          subject,
          html,
        });
      } catch (emailError) {
        console.error("📧 Email Error:", emailError);
      }
    }
  // }


  return res.status(200).json(new ApiResponse(200, job, `Job has been ${status}`));
});

const convertPdfToImage = async (pdfPath, outputPath) => {
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Extract the first page from the PDF (we're assuming single-page PDFs for simplicity)
  const firstPage = pdfDoc.getPages()[0];
  const { width, height } = firstPage.getSize();

  // Create an image from the PDF's first page using sharp
  await sharp({
    create: {
      width: Math.floor(width),
      height: Math.floor(height),
      channels: 3,  // RGB channels
      background: { r: 255, g: 255, b: 255 },  // white background
    },
  })
    .png()
    .toFile(outputPath);  // Save as PNG

  return outputPath; // Return the path where the image was saved
};

const extractJobInfofromText = asyncHandler(async (req, res) => {
  try {
    let { job_ad_text } = req.body;
    console.log("Job Ad Text Received in Backend:", job_ad_text);

        // URL decode job_ad_text before processing
        job_ad_text = decodeURIComponent(job_ad_text);
    
        // Remove the Location line if present
        job_ad_text = job_ad_text.replace(/Location:.*\n/g, "");

        console.log("Final text sent to model after decoding and removing line:", job_ad_text);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Extract job info and return JSON with these rules:

          KEY RULES:
          1. job_type MUST be one of: "Onsite", "Remote", "Hybrid", "Internship"
          2. Location names (like Karachi, Lahore) should NEVER be considered as job_type
          3. If no clear job type is found, default to "Onsite"

          FIELDS TO EXTRACT:
          - company_name (string)
          - title (string)
          - job_type (one of: "Onsite", "Remote", "Hybrid", "Internship")
          - qualification_req (string with bullet points)
          - job_description (string)
          - responsibilities (string with bullet points)
          - application_methods: array of {type, value, instructions}
          
          Rules for application_methods:
          1. Find ALL application methods in the text
          2. Types can be:
             - email (for email addresses)
             - website (for general URLs)
             - form (for application forms)
          3. Include any special instructions with each method
          4. Format emails as just the address (no mailto:)
          5. Phone numbers should be excluded from application methods
          5. For websites, ensure full URLs (add https:// if missing)
          
          Example input:
          "Apply to: jobs@company.com (Subject: DEV-123) or visit careers.company.com"
          
          Example output:
          {
            "application_methods": [
              {
                "type": "email",
                "value": "jobs@company.com",
                "instructions": "Subject: DEV-123"
              },
              {
                "type": "website",
                "value": "https://careers.company.com"
              }
            ]
          }
         
        `},
        {
          role: "user",
          content: job_ad_text
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.1
    });

    let extractedInfo = JSON.parse(completion.choices[0]?.message?.content || "{}");
    
    // Post-processing to clean up the data
    if (extractedInfo.application_methods) {
      extractedInfo.application_methods = extractedInfo.application_methods.map(method => {
        // Clean email values
        if (method.type === 'email' && method.value.includes('mailto:')) {
          method.value = method.value.replace('mailto:', '');
        }
        // Ensure website URLs have protocol
        if ((method.type === 'website' || method.type === 'form') && 
            !method.value.startsWith('http')) {
          method.value = `https://${method.value}`;
        }
        return method;
      });
    }
    
    res.json(extractedInfo);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to extract job information' });
  }
});

// Function to convert image to base64
const encodeImageToBase64 = (imagePath) => {
  const image = fs.readFileSync(imagePath);
  return image.toString('base64');
};

// Controller function to handle OCR using Groq Vision API and then extract job info
const extractJobInfoFromImageWithGroq = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    let extractedText = '';

    if (fileType.startsWith('image/')) {
      // Convert image to base64
      const base64Image = encodeImageToBase64(filePath);
      
      // Prepare the API request to Groq Vision API
      const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
      const apiKey = process.env.GROQ_API_KEY;  // Assuming you're storing your API key in an environment variable

      // Setup the message payload
      const payload = {
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: "What's in this image?" },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        model: 'meta-llama/llama-4-scout-17b-16e-instruct'  // Using Groq Vision model
      };

      // Make the API request to Groq Vision
      const response = await axios.post(apiUrl, payload, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      // Extract the text from the Groq response
      extractedText = response.data.choices[0]?.message?.content || '';

      if (!extractedText) {
        return res.status(500).json({ error: 'Failed to extract text from image' });
      }

      console.log('Extracted Text from Image:', extractedText);

      // Clean up the uploaded file after processing
      fs.unlinkSync(filePath);

      // Now pass the extracted text to the existing extractJobInfofromText function
      const jobAdText = { job_ad_text: extractedText };

      // Here, you can pass `req` and `res` to the `extractJobInfofromText` function
      req.body = jobAdText;  // Add job_ad_text to the request body
      return extractJobInfofromText(req, res);  // Call the text extraction function

    } else {
      return res.status(400).json({ error: 'Only image files are supported for OCR' });
    }

  } catch (error) {
    console.error('Error processing image with Groq Vision API:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
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
  extractJobInfofromText,
  extractJobInfoFromImageWithGroq,
};

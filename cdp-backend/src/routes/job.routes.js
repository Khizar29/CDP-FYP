const express = require("express");
const axios = require("axios");
const { Groq } = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getJobCount,
  getRecruiterJobs,
  approveJob,

} = require("../controllers/job.controller.js");
const { verifyJWT, verifyAdmin, verifyRole } = require("../middlewares/auth.middleware.js");

const router = express.Router();


router.use(verifyJWT);


// Routes accessible to all authenticated users
router.get('/count', getJobCount);
router.get('/', getAllJobs);
router.post('/', verifyRole(['admin', 'recruiter']), createJob);

router.get('/recruiter', verifyRole(['recruiter']), getRecruiterJobs);

router.post('/extract', verifyAdmin, async (req, res) => {
  try {
    const { job_ad_text } = req.body;
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Extract job info and return JSON with:
          -  company_name (string)
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
          Additionally:
          - If the text contains 'Location', do **NOT** consider it as job_type. job_type should be about work arrangements like "Onsite", "Remote", "Hybrid", or "Internship", not the geographical location.
        `},
        {
          role: "user",
          content: job_ad_text
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.3
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

router.use(verifyAdmin);

router.patch("/:jobId/approve", approveJob);
router.route('/:jobId').get(getJobById).put(updateJob).delete(deleteJob);


module.exports = router;

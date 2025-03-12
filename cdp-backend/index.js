const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./src/db/db.js");
const ApiError = require("./src/utils/ApiError.js");
// Load environment variables
dotenv.config({ path: './.env' });

const app = express();

// Middleware setup
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Serve static files from the public directory
app.use(express.static('./public'));

// Routes import
const userRouter = require('./src/routes/user.routes.js');
const jobRouter = require('./src/routes/job.routes.js');
const graduateRouter = require('./src/routes/graduate.routes.js');
const testimonialRouter = require("./src/routes/testimonial.routes.js");
const newsfeedRouter = require('./src/routes/newsfeed.routes.js');
const recruiterRouter = require('./src/routes/recruiter.routes.js');
const facultyRoutes = require("./src/routes/faculty.routes.js");
const announcementRoutes = require("./src/routes/announcement.routes.js");
// const jobApplicationRoutes = require("./src/routes/jobapplication.routes.js");

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/graduates", graduateRouter);
app.use("/api/v1/testimonials", testimonialRouter);
app.use("/api/v1/newsfeeds", newsfeedRouter);
app.use("/api/v1/recruiters", recruiterRouter);
app.use("/api/v1/faculty", facultyRoutes);
app.use("/api/v1/announcements", announcementRoutes);
// app.use("/api/v1/jobapplications", jobApplicationRoutes);

// Serve static files from the React frontend app's build folder
app.use(express.static(path.join(__dirname, '../cdp-frontend/build')));

// Catch-all handler for serving React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../cdp-frontend/build', 'index.html'));
});

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging

  // Check if the error is an instance of ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Handle other types of errors (e.g., 500 Internal Server Error)
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

// Use the error handler middleware in your Express app
app.use(errorHandler);

// Database connection and server start
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, '0.0.0.0', () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("❌ MONGO DB connection failed !!! ", err);
  });
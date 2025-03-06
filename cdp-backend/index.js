const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./src/db/db.js");

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

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/graduates", graduateRouter);
app.use("/api/v1/testimonials", testimonialRouter);
app.use("/api/v1/newsfeeds", newsfeedRouter);
app.use("/api/v1/recruiters", recruiterRouter);
app.use("/api/v1/faculty", facultyRoutes);
app.use("/api/v1/announcements", announcementRoutes);

// Serve static files from the React frontend app's build folder
app.use(express.static(path.join(__dirname, '../cdp-frontend/build')));

// Catch-all handler for serving React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../cdp-frontend/build', 'index.html'));
});

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


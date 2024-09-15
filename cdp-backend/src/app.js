import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path"; // Import path module
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES module replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../cdp-frontend/build')));

// Routes import
import userRouter from './routes/user.routes.js';
import jobRouter from './routes/job.routes.js';
import graduateRouter from './routes/graduate.routes.js';

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/graduates", graduateRouter);



// The "catchall" handler: for any request that doesn't match any route,
// send back the React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../cdp-frontend/build', 'index.html'));
});
export { app };

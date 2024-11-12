import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Graduate from '../models/graduate.model.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import path from "path";
import crypto from "crypto";

// Generate Access and Refresh Tokens
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token");
  }
};

// Register User and Send Password via Email
const registerUser = asyncHandler(async (req, res) => {
  const { email, fullName, nuId } = req.body;  // Receive email and fullName from frontend

  if (!email || !fullName || !nuId) {
    throw new ApiError(400, "Email and fullName are required");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Generate a random password
  const generatedPassword = crypto.randomBytes(8).toString('hex'); // Generates 16-character password

  // // Hash the password
  // const hashedPassword = await bcrypt.hash(generatedPassword, 10);
  // console.log(hashedPassword);
  

  // Create the user in the database
  const user = await User.create({
    fullName,
    email,
    nuId,
    password: generatedPassword, // Save the hashed password in the database
    role: "user",  // Default role, you can change it based on your logic
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Send the generated password to the user's email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL,  // Your Gmail address
      pass: process.env.GMAIL_PASSWORD,  // Your Gmail app password
    },
  });

  const mailOptions = {
    from: process.env.GMAIL,  // Sender address
    to: email,  // Receiver's email (the user who signed up)
    subject: 'Your New Account Password',
    html: `<p>Hello ${fullName},</p>
           <p>Thank you for registering on our platform. Here is your login password:</p>
           <p><strong>Password:</strong> ${generatedPassword}</p>
           <p>We recommend changing your password after the first login.</p>
           <p>Best regards,<br>Your Company</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error while sending email: ', error);
      throw new ApiError(500, 'Error while sending the email.');
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully and password emailed.")
  );
});

// Step 1: Check Graduate Existence and Display Email
const checkGraduate = asyncHandler(async (req, res) => {
  const { nuId } = req.body;

  if (!nuId) {
    throw new ApiError(400, "nuID is required");
  }

  // Check if the user already exists in the User collection
  const existingUser = await User.findOne({ nuId });

  if (existingUser) {
    throw new ApiError(409, "User with this nuID already exists");
  }

  // If not found in User, proceed to check the Graduate collection
  const graduate = await Graduate.findOne({ nuId });

  if (!graduate) {
    throw new ApiError(404, "Graduate not found with this nuID");
  }

  const personalEmail = graduate.personalEmail;
  const existedUser = await User.findOne({ email: personalEmail });

  if (existedUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Mask the email for frontend display
  const maskedEmail = maskEmail(personalEmail);

  return res.status(200).json(new ApiResponse(200, { maskedEmail }, "Graduate found. Confirm email to send password."));
});

// Step 2: Register Graduate as User and Send Password via Email
const registerGraduateAsUser = asyncHandler(async (req, res) => {
  const { nuId } = req.body;

  if (!nuId) {
    throw new ApiError(400, "nuID is required");
  }

  const graduate = await Graduate.findOne({ nuId });

  if (!graduate) {
    throw new ApiError(404, "Graduate not found with this nuID");
  }

  const personalEmail = graduate.personalEmail;
  const existedUser = await User.findOne({ email: personalEmail });

  if (existedUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Generate a random password
  const generatedPassword = crypto.randomBytes(8).toString('hex');

  // Create the user in the database
  const user = await User.create({
    fullName: `${graduate.firstName} ${graduate.lastName}`,
    email: personalEmail,
    nuId: graduate.nuId,
    password: generatedPassword,
    role: "user",
  });

  // Set up the email transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL,
    to: personalEmail,
    subject: 'Your New Account Password',
    html: `<p>Hello ${graduate.fullName},</p>
           <p>Thank you for registering on our platform. Here is your login password:</p>
           <p><strong>Password:</strong> ${generatedPassword}</p>
           <p>We recommend changing your password after the first login.</p>
           <p>Best regards,<br>Your Company</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error while sending email: ', error);
      throw new ApiError(500, 'Error while sending the email.');
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  return res.status(201).json(
    new ApiResponse(201, { user }, "Graduate registered successfully, and password emailed.")
  );
});

// Helper function to mask email for display
const maskEmail = (email) => {
  const [user, domain] = email.split('@');
  const maskedUser = user.slice(0, 4) + '****';
  return `${maskedUser}@${domain}`;
};


// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged In Successfully"
      )
    );
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from the document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// Change Current Password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
      )
    );
});

// Forget Password
const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  const secret = process.env.JWT_FORGET_TOKEN + user.password;
  const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: '10m' });
  console.log("Token generated:", token);
  
  const link = `${process.env.REACT_APP_BACKEND_URL}/reset-password/${user._id}/${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL,
    to: user.email,
    subject: 'Reset Password Request',
    html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Email</title>
          <style>
              body {
                  font-family: Helvetica, Arial, sans-serif;
                  min-width: 1000px;
                  overflow: auto;
                  line-height: 2;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  margin: 50px auto;
                  width: 70%;
                  padding: 20px 0;
                  background: #fff;
                  border: 1px solid #eee;
                  border-radius: 8px;
              }
              .header {
                  border-bottom: 1px solid #eee;
                  padding-bottom: 20px;
              }
              .header a {
                  font-size: 1.4em;
                  color: #00466a;
                  text-decoration: none;
                  font-weight: 600;
              }
              .content {
                  padding: 20px;
              }
              .content h2 {
                  background: #00466a;
                  margin: 0 auto;
                  width: max-content;
                  padding: 0 10px;
                  color: #fff;
                  border-radius: 4px;
              }
              .footer {
                  float: right;
                  padding: 8px 0;
                  color: #aaa;
                  font-size: 0.8em;
                  line-height: 1;
                  font-weight: 300;
              }
              .footer p {
                  margin: 0;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <a href="#">YourCompanyName</a>
              </div>
              <div class="content">
                  <p style="font-size: 1.1em;">Hi,</p>
                  <p>We received a request to reset your password. Click the link below to choose a new password. The link will expire in 30 minutes.</p>
                  <a href="${link}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 1.1em; color: #fff; background-color: #00466a; text-decoration: none; border-radius: 4px;">Reset Password</a>
                  <p style="font-size: 0.9em;">If you did not request this password reset, please ignore this email.</p>
                  <p style="font-size: 0.9em;">Regards,<br>YourCompanyName</p>
                  <hr style="border:none;border-top:1px solid #eee" />
              </div>
              <div class="footer">
                  <p>YourCompanyName Inc</p>
                  <p>1234 Your Street</p>
                  <p>Your City, Your Country</p>
              </div>
          </div>
      </body>
      </html>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new ApiError(500, 'Email could not be sent');
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  return res.status(200).json(new ApiResponse(200, {}, 'Password reset link sent successfully'));
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, 'Password is required');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  const secret = process.env.JWT_FORGET_TOKEN + user.password;
  console.log("Secret used for verifying token:", secret);
  console.log("Token received:", token);

  try {
    const verify = jwt.verify(token, secret);

    // Directly assign the new password, the pre-save middleware will hash it
    user.password = password;

    await user.save();  // No need to pass { validateBeforeSave: false }, we want validation to run

    return res.status(200).json(new ApiResponse(200, {}, 'Password updated successfully'));
  } catch (error) {
    console.log("Token verification failed:", error.message);
    throw new ApiError(400, 'Invalid or expired token');
  }
});

// Serve the Reset Password Page
const serveResetPasswordPage = (req, res) => {
  const __dirname = path.resolve();
  res.sendFile(path.join(__dirname, '../cdp-frontend', 'build', 'index.html'));
};

export {
  registerUser,
  checkGraduate,
  registerGraduateAsUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  forgetPassword,
  resetPassword,
  serveResetPasswordPage,
};

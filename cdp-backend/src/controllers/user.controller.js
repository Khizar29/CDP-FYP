import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import path from "path";

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

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log("Received data:", { fullName, email, password });

  if ([fullName, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const adminExists = await User.findOne({ role: "admin" });

  const user = await User.create({
    fullName,
    email,
    password,
    role: adminExists ? "user" : "admin",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdUser, "User registered Successfully")
    );
});

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
  
  const link = `http://localhost:8000/reset-password/${user._id}/${token}`;

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
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  forgetPassword,
  resetPassword,
  serveResetPasswordPage,
};

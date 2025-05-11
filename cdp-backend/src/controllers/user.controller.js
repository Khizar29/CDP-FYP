const  asyncHandler  = require("../utils/asyncHandler.js");
const  ApiError  = require("../utils/ApiError.js");
const  User  = require("../models/user.model.js");
const  ApiResponse  = require("../utils/ApiResponse.js");
const Graduate = require("../models/graduate.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const path = require("path");
const crypto = require("crypto");
const { log } = require("console");

// Generate Access and Refresh Tokens--
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

// Register User (student) and Send Password via Email
const registerUser = asyncHandler(async (req, res) => {
  let { email, fullName, nuId } = req.body;  // Receive input from frontend

  if (!email || !fullName || !nuId) {
    throw new ApiError(400, "NU ID, Email, and Full Name are required");
  }

  //  Convert all values to lowercase for consistency
  nuId = nuId.toLowerCase();
  email = email.toLowerCase();

  //  Check if email OR nuId already exists in DB
  const existedUser = await User.findOne({ $or: [{ email }, { nuId }] });
  if (existedUser) {
    throw new ApiError(409, "User with this Email or NU ID already exists");
  }

  //  Validate Email Format
  const emailRegex = /^([A-Z])(\d{2})(\d{4})@nu\.edu\.pk$/i; 
  const match = email.match(emailRegex);

  if (!match) {
    throw new ApiError(400, "Invalid email format. Use format: X21xxxx@nu.edu.pk where X is your campus code.");
  }

  //  Extract campus code, batch year & student ID from email
  const campusCode = match[1].toLowerCase(); // Convert to lowercase
  const batchYear = match[2]; // 21 (Batch Year)
  const studentNumber = match[3]; // 3249

  const expectedNuId = `${batchYear}${campusCode}-${studentNumber}`; // Convert format to lowercase

  //  Ensure NU ID matches expected format
  if (nuId !== expectedNuId) {
    throw new ApiError(400, `NU ID must match email pattern. Expected: ${expectedNuId}`);
  }

  //  Generate a secure random password
  const generatedPassword = crypto.randomBytes(8).toString("hex");

  //  Create the user in the database
  const user = await User.create({
    fullName,
    email,
    nuId,
    password: generatedPassword, // Store the generated password
    role: "user",  // Default role for students
  });

  //  Remove sensitive data before sending response
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Error while registering the user");
  }

  //  Send Email with Credentials
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL,  
      pass: process.env.GMAIL_PASSWORD,  
    },
  });

  const mailOptions = {
    from: `"Career Services and IL Office Karachi" <${process.env.GMAIL}>`,
    to: email,
    subject: "Your NU Student Account Password",
    html: `<p>Hello ${fullName},</p>
           <p>Your NU Student account has been successfully created.</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>NU ID:</strong> ${nuId}</p>
           <p><strong>Password:</strong> ${generatedPassword}</p>
           <p>We recommend changing your password after logging in.</p>
           <p style="font-size: medium; color: black;">
           <b>Best Regards,</b><br>
           Industrial Liaison/Career Services Office<br>
           021 111 128 128 ext. 184`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending email:", error);
    throw new ApiError(500, "Failed to send password email.");
  }

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
  const existingUser = await User.findOne({  nuId: nuId.toLowerCase() });

  if (existingUser) {
    
    
    throw new ApiError(409, "User with this nuID already exists");
  }

  // If not found in User, proceed to check the Graduate collection
  const graduate = await Graduate.findOne({ nuId: nuId.toLowerCase() });

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
  let { nuId } = req.body;

  if (!nuId) {
    throw new ApiError(400, "nuID is required");
  }
  nuId= nuId.toLowerCase();
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
    fullName: `${graduate.fullName}`,
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
    from:`"Career Services and IL Office Karachi" <${process.env.GMAIL}>`,
    to: personalEmail,
    subject: 'Your New Account Password',
    html: `<p>Hello ${graduate.fullName},</p>
           <p>Thank you for registering on our platform. Here is your login password:</p>
           <p><strong>Password:</strong> ${generatedPassword}</p>
           <p>We recommend changing your password after the first login.</p>
           <p style="font-size: medium; color: black;">
           <b>Best Regards,</b><br>
           Industrial Liaison/Career Services Office<br>
           021 111 128 128 ext. 184`,
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

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

  // Instead of cookies, return tokens in response
  return res
    .status(200)
    .json(new ApiResponse(
      200,
      { user: user.toObject(), accessToken, refreshToken },
      "User logged in successfully"
    ));
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
    sameSite: "None", // Ensure cookies are deleted in cross-origin requests
    path: "/", // Important for clearing cookies
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request - No refresh token");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token - User not found");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, { accessToken: newAccessToken, refreshToken: newRefreshToken }, "Access token refreshed"));
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
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


const checkSession = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(200).json({ success: true, sessionActive: false, user: null });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      return res.status(200).json({ success: true, sessionActive: false, user: null });
    }

    res.status(200).json({ success: true, sessionActive: true, user });
  } catch (error) {
    return res.status(200).json({ success: true, sessionActive: false, user: null });
  }
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
  
  const link = `${process.env.REACT_APP_FRONTEND_URL}/reset-password/${user._id}/${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Career Services and IL Office Karachi" <${process.env.GMAIL}>`,
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
                  <a href="#">Career Service Office</a>
              </div>
              <div class="content">
                  <p style="font-size: large; color: #00466a;">Hi, ${user.fullName}</p>
                  <p>We received a request to reset your password. Click the link below to choose a new password. The link will expire in 30 minutes.</p>
                  <a href="${link}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 1.1em; color: #fff; background-color: #00466a; text-decoration: none; border-radius: 4px;">Reset Password</a>
                  <p style="font-size: 0.9em;">If you did not request this password reset, please ignore this email.</p>
                  <p style="font-size: medium; color: black;">
                  <b>Best Regards,</b><br>
                  Industrial Liaison/Career Services Office<br>
                  021 111 128 128 ext. 184
                  </p>
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
  res.sendFile(path.join(__dirname, '.../cdp-frontend', 'build', 'index.html'));
};

module.exports = {
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
  checkSession,
};


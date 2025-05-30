const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("../utils/asyncHandler.js");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Get the token from the Authorization header (Bearer token)
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      return next(new ApiError(401, "Invalid Access Token"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid access token"));
  }
});

const verifyAdmin = asyncHandler(async (req, _, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Forbidden: Admins only");
  }
  next();
});

const verifyRole = (roles) => {
  return asyncHandler(async (req, _, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden: Insufficient role permissions");
    }
    next();
  });
};

// Create an optional version for public routes
verifyJWT.optional = asyncHandler(async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    req.user = null; // No authentication required
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      req.user = null; // Treat as unauthenticated user
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    req.user = null; // Invalid token, treat as unauthenticated user
    return next();
  }
});

module.exports = {
  verifyJWT,
  verifyAdmin,
  verifyRole,
};

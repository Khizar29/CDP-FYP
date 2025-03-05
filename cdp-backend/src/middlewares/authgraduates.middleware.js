const Graduate = require('../models/graduate.model.js');
const { ApiError } = require('../utils/ApiError.js');

const authorizeGraduate = async (req, res, next) => {
  const { nuId, role } = req.user; // Get nuId and role from the logged-in user's token

  const graduateId = req.params.nuId; // Get nuId from request parameters

  // If the user is an admin, bypass the authorization check
  if (role === 'admin') {
    return next();
  }

  // If the user is a graduate, check if they are trying to update their own profile
  if (nuId !== graduateId) {
    return next(new ApiError(403, 'Unauthorized to update this profile'));
  }

  // Graduate is authorized to update their own profile
  next();
};

// Export the middleware function using CommonJS
module.exports = {
  authorizeGraduate,
};

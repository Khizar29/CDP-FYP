const express = require("express");
const {
  registerUser,
  checkGraduate,
  registerGraduateAsUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  checkSession,
  forgetPassword,
  resetPassword,
  serveResetPasswordPage
} = require("../controllers/user.controller.js");

const { verifyJWT } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-session", checkSession);

// Graduate registration routes
router.post("/check-graduate", checkGraduate);
router.post("/register-graduate", registerGraduateAsUser);

// Secured routes
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.get("/current-user", verifyJWT, getCurrentUser);

// Password reset routes
router.post("/forgot-password", forgetPassword);
router.post("/reset-password/:id/:token", resetPassword);
router.get("/reset-password/:id/:token", serveResetPasswordPage);

module.exports = router;

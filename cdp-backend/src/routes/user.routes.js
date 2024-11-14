import { Router } from "express";
import {
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
  serveResetPasswordPage
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Graduate registration routes
router.route("/check-graduate").post(checkGraduate);
router.route("/register-graduate").post(registerGraduateAsUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);

// Password reset routes
router.post("/forgot-password", forgetPassword);
router.post("/reset-password/:id/:token", resetPassword);
router.get("/reset-password/:id/:token", serveResetPasswordPage);

export default router;

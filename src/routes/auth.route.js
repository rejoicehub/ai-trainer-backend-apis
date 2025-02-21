const express = require("express");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");
const { authValidation } = require("../validations");
const auth = require("../middlewares/auth");

const router = express.Router();

/**
 * Login
 */
router.post("/login", validate(authValidation.login), authController.userLogin);

/**
 * Signup
 */
router.post("/signup", validate(authValidation.signup), authController.signup);

/**
 * Update user
 */
router.put(
  "/updateUser",
  validate(authValidation.updateUser),
  authController.updateUser
);

/**
 * Send OTP.
 */
router.post(
  "/send-otp",
  validate(authValidation.sendOtp),
  authController.sendOtp
);

/**
 * Verify OTP.
 */
router.post(
  "/verify-otp",
  validate(authValidation.verifyOtp),
  authController.verifyOtp
);

/**
 * Forgot password.
 */
router.put(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);

/**
 * Change password.
 */
router.put(
  "/reset-password",
  auth,
  validate(authValidation.changePassword),
  authController.changePassword
);

module.exports = router;

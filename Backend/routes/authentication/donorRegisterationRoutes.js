"use strict";
const express = require("express");
const router = express.Router();
const {
  register,
  verifyEmailController,
  resendVerification,
} = require("../../controllers/authentication/donorRegisterationController");

// POST /api/auth/register - Register user or upgrade donor-only record.
router.post("/register", register);

// GET /api/auth/verify-email - Verify email (expects query: email, token).
router.get("/verify-email", verifyEmailController);
// POST /api/auth/resend-verification - Resend verification email (expects { email } in body).
router.post("/resend-verification", resendVerification);

module.exports = router;

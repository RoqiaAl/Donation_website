"use strict";

const express = require("express");
const router = express.Router();

// Import the controllers
const adminRegController = require("../../controllers/authentication/adminRegistrationController");
const admin2faController = require("../../controllers/authentication/admin2faController");

// Route to register a new admin account.
// Expected request: POST /api/auth/register with JSON body { email, password, phone, username, role }
router.post("/register", adminRegController.register);

// Route to resend the secure 2FA setup link via email.
// Expected request: POST /api/auth/resend-verification with JSON body { email }
router.post("/resend-verification", adminRegController.resendVerification);

// Route to render the secure 2FA setup page.
// Expected request: GET /admin/2fa-setup?token=<one-time-token>&email=<admin-email>
router.get("/2fa-setup", admin2faController.render2faSetup);

module.exports = router;

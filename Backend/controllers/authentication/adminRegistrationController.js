"use strict";

const {
  registerAdmin,
  resendVerificationEmail,
} = require("../../services/authentication/adminRegistrationService");

/**
 * Controller method for registering an admin.
 * Expects JSON body with { email, password, phone, username, role }.
 */
async function register(req, res) {
  try {
    const result = await registerAdmin(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error during admin registration:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Controller method for resending the verification email (secure 2FA setup link).
 * Expects JSON body with { email }.
 */
async function resendVerification(req, res) {
  try {
    const { email } = req.body;
    const result = await resendVerificationEmail(email);
    res.json(result);
  } catch (error) {
    console.error("Error resending verification email:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { register, resendVerification };

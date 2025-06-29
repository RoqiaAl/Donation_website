"use strict";
const {
  registerUser,
  verifyEmail,
  resendVerificationEmail,
} = require("../../services/authentication/donorRegisterationService");

/**
 * Controller method for user registration.
 */
async function register(req, res) {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Controller method for verifying email.
 * Expects query parameters: email and token.
 */
async function verifyEmailController(req, res) {
  const { email, token } = req.query;
  try {
    await verifyEmail(email, token);
    // On success, redirect directly to the login page.
    return res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (error) {
    console.error("Error during email verification:", error);
    // On failure, redirect to an error page with the error message and email.
    return res.redirect(
      `${process.env.FRONTEND_URL}/verify-error?msg=${encodeURIComponent(
        error.message
      )}&email=${encodeURIComponent(email)}`
    );
  }
}
/**
 * Controller method for resending verification email.
 * Expects { email } in the request body.
 */
async function resendVerification(req, res) {
  const { email } = req.body;
  try {
    const result = await resendVerificationEmail(email);
    res.json(result);
  } catch (error) {
    console.error("Error resending verification email:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { register, verifyEmailController, resendVerification };

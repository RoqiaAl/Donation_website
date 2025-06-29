"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Auth, User } = require("../../models");
const { sendEmail } = require("../../utils/emailUtils");
const { where } = require("sequelize");
require("dotenv").config({ path: "./config/.env" });

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

/**
 * Logs in a user by validating their credentials.
 * @param {Object} loginData - Contains: email and password.
 * @returns {Object} - An object with a JWT token and basic user info.
 */
async function loginUser(loginData) {
  const { email, password } = loginData;
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  // 1️⃣ Find the Auth record
  const authRecord = await Auth.findOne({ where: { email } });
  if (!authRecord) {
    throw new Error("User not found.");
  }

  // 2️⃣ Ensure user has verified
  if (authRecord.verification_token) {
    throw new Error(
      "Email not verified. Please verify your email before logging in."
    );
  }

  // 3️⃣ Check the password
  const isMatch = await bcrypt.compare(password, authRecord.password_hash);
  if (!isMatch) {
    throw new Error("Invalid credentials.");
  }

  // 4️⃣ Now fetch the User row
  const userRecord = await User.findOne({
    where: { id: authRecord.id },
  });
  if (!userRecord) {
    throw new Error("User profile not found.");
  }

  // 5️⃣ Build and sign a JWT using the User.id
  const payload = {
    id: userRecord.id, // ← matches Donor.user_id lookup
    email: authRecord.email,
    role: authRecord.role,
    user_name: userRecord.user_name,
  };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { token, user: payload };
}

/**
 * Helper: Generate a reset token and its expiration (1 hour from now).
 * @returns {Object} - Contains: token, expires.
 */
function generateResetToken() {
  const token = crypto.randomBytes(20).toString("hex");
  const expires = new Date(Date.now() + 3600000); // 1 hour expiry
  return { token, expires };
}

/**
 * Initiates a password reset request.
 * Looks up the Auth record by email, generates a reset token,
 * saves it to the record, and sends a reset password email.
 *
 * @param {string} email - The user's email.
 * @returns {Object} - A success message.
 */
async function requestPasswordReset(email) {
  if (!email) {
    throw new Error("Email is required.");
  }

  const authRecord = await Auth.findOne({ where: { email } });
  if (!authRecord) {
    throw new Error("User not found.");
  }

  // Generate reset token and expiration.
  const { token, expires } = generateResetToken();

  // Save token and expiration to the Auth record.
  authRecord.reset_token = token;
  authRecord.reset_token_expiration = expires;
  await authRecord.save();

  // Build reset password link (adjust domain and path as needed)
  const resetLink = `${
    process.env.FRONTEND_URL
  }/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  // Create email content.
  const emailHtml = `
    <h1>Password Reset Request</h1>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>This link will expire in 1 hour.</p>
  `;

  await sendEmail({
    to: email,
    subject: "Password Reset Request",
    html: emailHtml,
    text: `Please reset your password by visiting: ${resetLink}`,
  });

  return {
    success: true,
    message: "Password reset email sent. Please check your email.",
  };
}

/**
 * Resets the password using the provided token.
 * Validates that the token is correct and not expired,
 * then updates the password and clears the reset token fields.
 *
 * @param {Object} resetData - Contains: email, token, newPassword.
 * @returns {Object} - A success message.
 */
async function resetPassword(resetData) {
  const { email, token, newPassword } = resetData;
  if (!email || !token || !newPassword) {
    throw new Error("Email, token, and new password are required.");
  }

  const authRecord = await Auth.findOne({ where: { email } });
  if (!authRecord) {
    throw new Error("User not found.");
  }

  // Check if token matches and is not expired.
  if (authRecord.reset_token !== token) {
    throw new Error("Invalid reset token.");
  }
  if (new Date() > authRecord.reset_token_expiration) {
    throw new Error("Reset token has expired.");
  }

  // Hash the new password and update the Auth record.
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  authRecord.password_hash = hashedPassword;

  // Clear the reset token fields.
  authRecord.reset_token = null;
  authRecord.reset_token_expiration = null;

  await authRecord.save();

  return {
    success: true,
    message: "Password has been reset successfully.",
  };
}

module.exports = { loginUser, requestPasswordReset, resetPassword };

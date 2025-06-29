"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const speakeasy = require("speakeasy");
const { Auth, User, sequelize } = require("../../models");
const { sendEmail } = require("../../utils/emailUtils");
require("dotenv").config({ path: "./config/.env" });

// Helper: Generates a one-time token and its expiration (1 hour from now).
function generateVerificationToken() {
  const token = crypto.randomBytes(20).toString("hex");
  const expires = new Date(Date.now() + 3600000); // valid for 1 hour
  return { token, expires };
}

/**

 * @param {Object} registrationData - Contains: email, password, phone, username, role.
 * @returns {Object} - A success message.
 */
async function registerAdmin(registrationData) {
  const { email, username, password, phone, role } = registrationData;
  if (!email || !username || !password || !role) {
    throw new Error("Email, username, password, and role are required.");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Generate a one-time token for securing the 2FA setup link
  const { token, expires } = generateVerificationToken();

  const t = await sequelize.transaction();
  let authRecord, userRecord;
  try {
    // 1) Check if the Auth record already exists
    authRecord = await Auth.findOne({ where: { email } }, { transaction: t });
    if (authRecord) {
      throw new Error(
        "Email is already taken. Please log in or choose another email."
      );
    }

    // 2) Create Auth record with the specified admin role
    authRecord = await Auth.create(
      {
        email,
        password_hash: hashedPassword,
        role, // e.g., admin role (typically 3)
        user_status: 1,
        // Store the one-time token and its expiration to secure the 2FA setup page
        verification_token: token,
        token_expiration: expires,
      },
      { transaction: t }
    );

    // 3) Create the corresponding User record
    userRecord = await User.create(
      { id: authRecord.id, username, phone },
      { transaction: t }
    );

    // 4) Generate TOTP secret for 2FA using Speakeasy
    const totpSecret = speakeasy.generateSecret({
      name: `Admin Portal (${email})`,
    });
    // Store the Base32 secret in the Auth record (ensure your Auth model has a totp_secret column)
    authRecord.totp_secret = totpSecret.base32;
    await authRecord.save({ transaction: t });

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }

  // After commit, send an email with a secure link to the 2FA setup page.
  try {
    // Construct the secure 2FA setup link.
  
    const setupLink = `${
      process.env.BASE_URL
    }/auth/admin/2fa-setup?token=${token}&email=${encodeURIComponent(email)}`;

    const emailHtml = `
      <h1>Admin Account Created</h1>
      <p>Your admin account has been created successfully.</p>
      <p>For security, please complete your two-factor authentication (2FA) setup by clicking the link below:</p>
      <a href="${setupLink}">${setupLink}</a>
      <p>This link is valid for 1 hour.</p>
    `;
    await sendEmail({
      to: email,
      subject: "Complete Your Admin 2FA Setup",
      html: emailHtml,
      text: `Complete your 2FA setup by visiting: ${setupLink}`,
    });
  } catch (emailError) {
    console.error("Error sending 2FA setup link email:", emailError);
    // Registration still succeeds even if email sending fails.
  }

  return {
    success: true,
    message:
      "Registration initiated. Please check your email to complete your 2FA setup.",
  };
}

/**
 * Resends a new verification email (secure 2FA setup link) for an unverified admin account.
 *
 * @param {string} email - Admin's email.
 * @returns {Object} - A success message.
 */
async function resendVerificationEmail(email) {
  if (!email) {
    throw new Error("Email is required.");
  }

  const authRecord = await Auth.findOne({ where: { email } });
  if (!authRecord) {
    throw new Error("Admin not found.");
  }
  // If the verification token is already cleared, assume the email is verified.
  if (!authRecord.verification_token) {
    throw new Error("Email is already verified.");
  }

  // Generate a new token and expiration
  const { token, expires } = generateVerificationToken();
  authRecord.verification_token = token;
  authRecord.token_expiration = expires;
  await authRecord.save();

  // Construct the secure 2FA setup link
  const setupLink = `${
    process.env.BASE_URL
  }/auth/admin/2fa-setup?token=${token}&email=${encodeURIComponent(email)}`;
  const emailHtml = `
    <h1>Complete Your Admin 2FA Setup</h1>
    <p>Please click the link below to complete your two-factor authentication setup:</p>
    <a href="${setupLink}">${setupLink}</a>
    <p>This link will expire in 1 hour.</p>
  `;
  await sendEmail({
    to: email,
    subject: "Resend: Complete Your Admin 2FA Setup",
    html: emailHtml,
    text: `Complete your 2FA setup by visiting: ${setupLink}`,
  });

  return {
    success: true,
    message: "Verification email resent. Please check your email.",
  };
}

module.exports = { registerAdmin, resendVerificationEmail };

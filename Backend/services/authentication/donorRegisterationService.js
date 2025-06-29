"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Auth, User, Donor, sequelize } = require("../../models");
const { sendEmail } = require("../../utils/emailUtils");
require("dotenv").config({ path: "./config/.env" });

// Constants for roles
const REGISTERED_ROLE = 2; // Fully registered account
const UNREGISTERED_ROLE = 1; // Donor-only account

/**
 * Helper: Generates a verification token and its expiration (1 hour from now).
 */
function generateVerificationToken() {
  const token = crypto.randomBytes(20).toString("hex");
  const expires = new Date(Date.now() + 3600000); // 1 hour expiry
  return { token, expires };
}

/**
 * Registers a user (or upgrades an existing donor-only record).
 * Updates the Auth record by setting a hashed password and changing role from 1 to 2.
 * Also updates the corresponding User record (phone and username) and Donor record (governorate).
 * Sends a verification email after successful registration.
 *
 * @param {Object} registrationData - Contains: email, password, phone, username, governorate.
 * @returns {Object} - A success message.
 */
async function registerUser(registrationData) {
  const { email, password, phone, username, governorate } = registrationData;
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const { token, expires } = generateVerificationToken();

  const t = await sequelize.transaction();
  let authRecord, userRecord, donorRecord;
  try {
    authRecord = await Auth.findOne({ where: { email } }, { transaction: t });
    if (!authRecord) {
      authRecord = await Auth.create(
        {
          email,
          password_hash: hashedPassword,
          role: REGISTERED_ROLE,
          verification_token: token,
          token_expiration: expires,
          user_status: 1,
        },
        { transaction: t }
      );

      userRecord = await User.create(
        {
          id: authRecord.id,
          phone,
          user_name: username, // ✅ updated
        },
        { transaction: t }
      );

      donorRecord = await Donor.create(
        {
          id: userRecord.id,
          governorate_id: governorate, // ✅ updated
        },
        { transaction: t }
      );
    } else {
      if (authRecord.role === UNREGISTERED_ROLE) {
        authRecord.password_hash = hashedPassword;
        authRecord.verification_token = token;
        authRecord.token_expiration = expires;
        authRecord.role = REGISTERED_ROLE;
        await authRecord.save({ transaction: t });

        userRecord = await User.findOne(
          { where: { id: authRecord.id } },
          { transaction: t }
        );
        if (!userRecord) {
          userRecord = await User.create(
            { id: authRecord.id, phone, user_name: username }, // ✅ updated
            { transaction: t }
          );
        } else {
          userRecord.phone = phone || userRecord.phone;
          userRecord.user_name = username || userRecord.user_name; // ✅ updated
          await userRecord.save({ transaction: t });
        }

        donorRecord = await Donor.findOne(
          { where: { id: userRecord.id } },
          { transaction: t }
        );
        if (!donorRecord) {
          donorRecord = await Donor.create(
            { id: userRecord.id, governorate_id: governorate }, // ✅ updated
            { transaction: t }
          );
        } else {
          donorRecord.governorate_id =
            governorate || donorRecord.governorate_id; // ✅ updated
          await donorRecord.save({ transaction: t });
        }
      } else {
        throw new Error(
          "This email is already registered. Please log in or reset your password."
        );
      }
    }
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }

  try {
    const verificationLink = `${
      process.env.BASE_URL
    }/auth/donor/verify-email?token=${token}&email=${encodeURIComponent(
      email
    )}`;
    const emailHtml = `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">${verificationLink}</a>
      <p>This link will expire in 1 hour.</p>
    `;
    await sendEmail({
      to: email,
      subject: "Verify Your Email Address",
      html: emailHtml,
      text: `Please verify your email by visiting: ${verificationLink}`,
    });
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
  }

  return {
    success: true,
    message:
      "Registration initiated. Please check your email to verify your account.",
  };
}

/**
 * Verifies the email using the provided token.
 * If successful, clears the verification token fields.
 *
 * @param {string} email - User's email.
 * @param {string} token - Verification token.
 * @returns {Object} - A success message.
 */
// services/authService.js
async function verifyEmail(email, token) {
  if (!email || !token) {
    throw new Error("Missing email or token.");
  }
  const authRecord = await Auth.findOne({ where: { email } });
  if (!authRecord) {
    throw new Error("User not found.");
  }
  
  if (authRecord.verification_token !== token) {
    throw new Error("Invalid verification token.");
  }

  if (new Date() > authRecord.token_expires) {
    throw new Error("Verification token has expired.");
  }
  // Mark as verified by clearing token fields.
  authRecord.verification_token = null;
  authRecord.token_expires = null;
  await authRecord.save();
  return {
    success: true,
    message: "Email verified successfully. Your account is now active.",
  };
}

/**
 * Resends a new verification email for an unverified account.
 *
 * @param {string} email - User's email.
 * @returns {Object} - A success message.
 */
async function resendVerificationEmail(email) {
  if (!email) {
    throw new Error("Email is required.");
  }
  const authRecord = await Auth.findOne({ where: { email } });
  if (!authRecord) {
    throw new Error("User not found.");
  }
  if (authRecord.role === REGISTERED_ROLE && !authRecord.verification_token) {
    throw new Error("Email is already verified.");
  }
  const { token, expires } = generateVerificationToken();
  authRecord.verification_token = token;
  authRecord.token_expiration = expires;
  await authRecord.save();
  const verificationLink = `${
    process.env.BASE_URL
  }/auth/donor/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
  const emailHtml = `
    <h1>Email Verification</h1>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationLink}">${verificationLink}</a>
    <p>This link will expire in 1 hour.</p>
  `;
  await sendEmail({
    to: email,
    subject: "Resend: Verify Your Email Address",
    html: emailHtml,
    text: `Please verify your email by visiting: ${verificationLink}`,
  });
  return {
    success: true,
    message: "Verification email resent. Please check your email.",
  };
}

module.exports = { registerUser, verifyEmail, resendVerificationEmail };

"use strict";

const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const jwt = require("jsonwebtoken");
const { Auth } = require("../../models");

// You can set these in your environment or use defaults
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

/**
 * Logs in an admin user by verifying email, password, and TOTP code.
 * Returns a JWT if successful.
 * @param {Object} loginData - { email, password, totp_code }
 * @returns {Object} - { success, token, message }
 */
async function loginAdmin(loginData) {
  const { email, password, totp_code } = loginData;
  if (!email || !password || !totp_code) {
    throw new Error("Email, password, and TOTP code are required.");
  }

  // 1) Find the Auth record by email
  const authRecord = await Auth.findOne({ where: { email } });
  if (!authRecord) {
    throw new Error("Invalid credentials.");
  }

  // 2) Check the password
  const match = await bcrypt.compare(password, authRecord.password_hash);
  if (!match) {
    throw new Error("Invalid credentials.");
  }

  // 3) Verify the TOTP code
  const verified = speakeasy.totp.verify({
    secret: authRecord.totp_secret, // stored in the Auth record during registration
    encoding: "base32",
    token: totp_code, // the 6-digit code from the user
    window: 1, // allow small time window for clock drift
  });
  if (!verified) {
    throw new Error("Invalid TOTP code.");
  }

  // 4) Generate a JWT (optional, but common for session management)
  const payload = {
    Id: authRecord.id,
    email: authRecord.email,
    role: authRecord.role,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return {
    success: true,
    token,
    message: "Login successful!",
  };
}

module.exports = { loginAdmin };

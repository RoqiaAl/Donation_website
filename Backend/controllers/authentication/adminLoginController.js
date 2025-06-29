"use strict";

const {
  loginAdmin,
  resetAdminQRCode,
} = require("../../services/authentication/adminLoginService");

/**
 * Controller method for admin login.
 * Expects { email, password, totp_code } in the request body.
 */
async function login(req, res) {
  try {
    const result = await loginAdmin(req.body);
    res.json(result);
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(401).json({ success: false, message: error.message });
  }
}

/**
 * Controller method for resetting the admin QR code for 2FA.
 * Expects { email } in the request body.
 */

module.exports = { login };

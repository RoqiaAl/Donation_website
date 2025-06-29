"use strict";

const { loginUser, requestPasswordReset, resetPassword } = require("../../services/authentication/donorLoginService");

/**
 * Controller method for logging in a user.
 * Expects a JSON body with { email, password }.
 */
async function login(req, res) {
  try {
    const result = await loginUser(req.body);
    res.json({ success: true, token: result.token, user: result.user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(401).json({ success: false, message: error.message });
  }
}

/**
 * Controller method for initiating a password reset.
 * Expects a JSON body with { email }.
 */
async function requestReset(req, res) {
  try {
    const { email } = req.body;
    const result = await requestPasswordReset(email);
    res.json(result);
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Controller method for resetting the password.
 * Expects a JSON body with { email, token, newPassword }.
 */
async function reset(req, res) {
  try {
    const { email, token, newPassword } = req.body;
    const result = await resetPassword({ email, token, newPassword });
    res.json(result);
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { login, requestReset, reset };

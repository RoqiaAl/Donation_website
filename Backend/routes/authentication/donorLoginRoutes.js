"use strict";
const express = require("express");
const router = express.Router();
const {
  login,
  requestReset,
  reset,
} = require("../../controllers/authentication/donorLoginController");

// POST /api/auth/login - Login endpoint.
router.post("/login", login);

// POST /api/auth/request-reset - Initiates a password reset.
router.post("/request-reset", requestReset);

// POST /api/auth/reset-password - Resets the password using the provided token.
router.post("/reset-password", reset);

module.exports = router;

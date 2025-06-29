"use strict";
const express = require("express");
const router = express.Router();
const {
  login,
  resetQRCode,
} = require("../../controllers/authentication/adminLoginController");

// POST /api/admin/login - Admin login endpoint
router.post("/login", login);

module.exports = router;

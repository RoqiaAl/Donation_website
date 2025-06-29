"use strict";
const express = require("express");
const router = express.Router();
const authMiddleware = require("../utils/authMiddleware");
const donateAuthCtrl = require("../controllers/donateWithAccountController");

router.post(
  "/once",
  authMiddleware,
  donateAuthCtrl.onceDonation.bind(donateAuthCtrl)
);
router.post(
  "/recurring",
  authMiddleware,
  donateAuthCtrl.recurringDonation.bind(donateAuthCtrl)
);

module.exports = router;

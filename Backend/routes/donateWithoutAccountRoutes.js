"use strict";

const express = require("express");
const router = express.Router();
const donationProcessController = require("../controllers/donateWithoutAccountController");

// Process a one-time donation.
// Use the method name `onceDonation` as defined in the controller.
router.post(
  "/onceDonation",
  donationProcessController.onceDonation.bind(donationProcessController)
);

// Process a recurring donation.
// Use the method name `recurringDonation` as defined in the controller.
router.post(
  "/recurringDonation",
  donationProcessController.recurringDonation.bind(donationProcessController)
  
);

// Get basic donor info by email.
router.get(
  "/getBasicDonorInfo",
  donationProcessController.getDonorInfoByEmail.bind(donationProcessController)
);

module.exports = router;

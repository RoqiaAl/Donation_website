"use strict";
const donationService = require("../services/donationService");

class DonateWithAccountController {
  async onceDonation(req, res) {
    try {
      const result = await donationService.oneTimeDonationWithAccount(
        req.body,
        req.user
      );
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  async recurringDonation(req, res) {
    try {
      const result = await donationService.recurringDonationWithAccount(
        req.body,
        req.user
      );
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new DonateWithAccountController();

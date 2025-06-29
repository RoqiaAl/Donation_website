"use strict";

const donationProcessService = require("../services/donationService");

class DonationProcessController {
  /**
   * POST /donate-without-account/onceDonation
   * Calls the oneTimeDonation() method in the service.
   */
  async onceDonation(req, res) {
    try {
      const donationData = req.body;
      const result = await donationProcessService.oneTimeDonation(donationData);
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error processing one-time donation:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /donate-without-account/recurringDonation
   * Calls the recurringDonation() method in the service.
   */
  async recurringDonation(req, res) {
    try {
      const donationData = req.body;
      const result = await donationProcessService.recurringDonation(
        donationData
      );
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error processing recurring donation:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /donate-without-account/donorInfo?email=...
   * Calls getDonorInfoByEmail() in the service.
   */
  async getDonorInfoByEmail(req, res) {
    try {
      const { email } = req.query;
      if (!email) {
        return res
          .status(400)
          .json({ error: "Email query parameter is required." });
      }

      const info = await donationProcessService.getDonorInfoByEmail(email);
      if (!info) {
        return res.status(404).json({ message: "Donor not found." });
      }

      return res.status(200).json(info);
    } catch (error) {
      console.error("Error fetching donor info:", error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new DonationProcessController();

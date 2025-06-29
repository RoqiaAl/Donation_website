const recurringDonationService = require("../services/recurringDonationService");

class RecurringDonationController {
  // Get all recurring donations
  async getAll(req, res) {
    try {
      const recurringDonations =
        await recurringDonationService.getAllRecurringDonations();
      res.status(200).json(recurringDonations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get recurring donation by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const recurringDonation =
        await recurringDonationService.getRecurringDonationById(id);
      if (!recurringDonation)
        return res.status(404).json({ error: "Recurring Donation not found" });

      res.status(200).json(recurringDonation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get recurring donations by Donor ID
  async getByDonorId(req, res) {
    try {
      const { donorId } = req.params;
      const recurringDonations =
        await recurringDonationService.getRecurringDonationsByDonorId(donorId);
      res.status(200).json(recurringDonations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create a new recurring donation
  async create(req, res) {
    try {
      const newRecurringDonation =
        await recurringDonationService.createRecurringDonation(req.body);
      res.status(201).json(newRecurringDonation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update a recurring donation
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedRecurringDonation =
        await recurringDonationService.updateRecurringDonation(id, req.body);
      res.status(200).json(updatedRecurringDonation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ✅ Update only the status of a recurring donation
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (typeof status !== "number") {
        return res.status(400).json({ error: "Invalid status value" });
      }

      const updatedRecurringDonation =
        await recurringDonationService.updateRecurringDonationStatus(
          id,
          status
        );
      res.status(200).json(updatedRecurringDonation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete a recurring donation
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await recurringDonationService.deleteRecurringDonation(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new RecurringDonationController();

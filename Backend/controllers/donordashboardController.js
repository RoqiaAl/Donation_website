// controllers/donorController.js
const donorService = require("../services/donorDashboardService");
const {
  getDonorProfile,
  updateDonorProfile,
  updateRecurringDonationStatus,
} = require("../services/donorDashboardService");

exports.donorDashboardStatistics = async (req, res) => {
  try {
    const donorId = req.params.donorId;

    if (!donorId) {
      return res.status(400).json({ error: "Donor ID is required" });
    }

    const result = await donorService.donorDashboardStatistics(donorId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.donationsAndCharts = async (req, res) => {
  try {
    const donorId = req.params.donorId;

    if (!donorId) {
      return res.status(400).json({ error: "Donor ID is required" });
    }

    const result = await donorService.donationsAndCharts(donorId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDonorDetails = async (req, res) => {
  try {
    const donorId = req.params.donorId; // assuming JWT middleware sets req.user
    const donor = await getDonorProfile(donorId);
    if (!donor) return res.status(404).json({ message: "Donor not found" });
    res.json(donor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch donor data" });
  }
};

exports.updateDonorDetails = async (req, res) => {
  try {
    const donorId = req.params.donorId;
    await updateDonorProfile(donorId, req.body);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update donor data" });
  }
};

exports.getRecurringDonations = async (req, res) => {
  const donorId = req.params.donorId;
  try {
    const donations = await donorService.getRecurringDonationDetails(donorId);
    res.status(200).json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve recurring donations" });
  }
};

exports.updateRecurringDonationStatus = async (req, res) => {
  const { donationId } = req.params;
  const { newStatusId } = req.body;

  if (!newStatusId) {
    return res.status(400).json({ error: "newStatusId is required" });
  }

  try {
    const updatedDonation = await updateRecurringDonationStatus(
      donationId,
      newStatusId
    );

    res.status(200).json({
      message: "Recurring donation status updated successfully.",
      data: updatedDonation,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getDonorTransactions = async (req, res) => {
  try {
    const donorId = req.params.donorId;
    if (!donorId) {
      return res
        .status(400)
        .json({ success: false, message: "Donor ID is required" });
    }

    const data = await donorService.getTransactionsByDonor(donorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error getting donor transactions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getDonorDonations = async (req, res) => {
  const donorId = req.params.donorId;

  try {
    const donations = await donorService.getDonorDonations(donorId);
    res.status(200).json(donations);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching donor donations",
        error: error.message,
      });
  }
};

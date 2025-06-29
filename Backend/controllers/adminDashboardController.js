const adminDashboardService = require("../services/adminDashboardService");

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await adminDashboardService.getAdminDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

exports.getMonthlyDonations = async (req, res) => {
  try {
    const result = await adminDashboardService.getMonthlyDonations();

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        details: result.details,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

exports.getDonorsByGovernorate = async (req, res) => {
  try {
    const result = await adminDashboardService.getDonorsByGovernorate();

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        details: result.details,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

exports.getTopProjectsByDonations = async (req, res) => {
  try {
    const limit = req.query.limit || 5;
    const result = await adminDashboardService.getTopProjectsByDonations(limit);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        details: result.details,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

exports.getRecentDonations = async (req, res) => {
  try {
    const limit = req.query.limit || 5;
    const result = await adminDashboardService.getRecentDonations(limit);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        details: result.details,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await adminDashboardService.getUserDetails();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editUserData = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    const result = await adminDashboardService.updateUserData(id, data);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changeUserStatus = async (req, res) => {
  const id = req.params.id;
  const { user_status } = req.body;

  try {
    const result = await adminDashboardService.updateUserStatus(
      id,
      user_status
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDonors = async (req, res) => {
  try {
    const donors = await adminDashboardService.getAllDonors();
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDonor = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedDonor = await adminDashboardService.updateDonorProfile(
      id,
      updatedData
    );
    res.status(200).json(updatedDonor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createDonor = async (req, res) => {
  try {
    const { id } = req.params;
    const donorData = req.body;

    const newDonor = await donorService.createDonor(id, donorData);

    res.status(201).json({
      message: "Donor created successfully",
      data: newDonor,
    });
  } catch (error) {
    console.error("Error creating donor:", error);
    res.status(500).json({
      message: "Failed to create donor",
      error: error.message,
    });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await adminDashboardService.getAllDonations();
    res.status(200).json(donations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching all donations", error: error.message });
  }
};

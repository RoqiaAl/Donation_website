// controllers/statisticsController.js
const { Project, Donation, Testimonial } = require("../models");
// ← pull in fn and col from sequelize
const { fn, col } = require("sequelize");

async function overviewStatistics(req, res) {
  try {
    // 1️⃣ Count active projects
    const activeProjects = await Project.count({});

    // 2️⃣ Sum total beneficiaries across *all* projects
    const totalBeneficiaries = await Project.sum("totalBeneficiaries");

    // 3️⃣ Sum all donations
    const fundsRaised = await Donation.sum("amount");

    // 4️⃣ Number of distinct project locations = communities served
    const communitiesServed = await Project.count({
      distinct: true,
      col: "governate",
    });

    return res.json({
      success: true,
      data: {
        activeProjects,
        totalBeneficiaries,
        fundsRaised,
        communitiesServed,
      },
    });
  } catch (err) {
    console.error("Statistics error:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
}

async function getTestimonialStats(req, res) {
  try {
    // total testimonials
    const total = await Testimonial.count();

    // count per status
    const byStatusRows = await Testimonial.findAll({
      attributes: [
        "status",
        [fn("COUNT", col("id")), "count"]
      ],
      group: ["status"]
    });

    const byStatus = byStatusRows.map((row) => ({
      status: row.get("status"),
      count: parseInt(row.get("count"), 10),
    }));

    res.json({
      success: true,
      data: { total, byStatus },
    });
  } catch (error) {
    console.error("Error fetching testimonial stats:", error);
    res.status(500).json({
      success: false,
      message: "Could not fetch testimonial statistics",
    });
  }
}

module.exports = { overviewStatistics, getTestimonialStats };

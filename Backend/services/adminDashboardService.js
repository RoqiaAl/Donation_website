const sequelize = require("sequelize");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const { Op, fn, col, literal } = require("sequelize");
const {
  Project,
  Donor,
  Auth,
  Donation,
  RecurringDonation,
  Transaction,
  Partner,
  Role,
  User,
  ReferenceData,
} = require("../models");

exports.getAdminDashboardStats = async () => {
  const [
    projectsCount,
    activeDonorsCount,
    donationsCount,
    recurringCount,
    transactionsCount,
    partnersCount,
  ] = await Promise.all([
    Project.count(), // Count of projects
    Auth.count({
      where: {
        user_status: 1,
        role: { [Op.in]: [1, 2] }, // Active individual/organization donors
      },
    }),
    Donation.count(),
    RecurringDonation.count({
      where: { recurring_donation_status: 4 }, // Active recurring donations
    }),
    Transaction.count({
      where: { payment_status: 1 }, // Completed transactions
    }),
    Partner.count(),
  ]);

  return {
    projects: projectsCount,
    activeDonors: activeDonorsCount,
    donations: donationsCount,
    recurringDonations: recurringCount,
    transactions: transactionsCount,
    partners: partnersCount,
  };
};

exports.getMonthlyDonations = async () => {
  try {
    const monthlyDonations = await Donation.findAll({
      attributes: [
        [
          sequelize.fn("EXTRACT", sequelize.literal("YEAR FROM donation_date")),
          "year",
        ],
        [
          sequelize.fn(
            "EXTRACT",
            sequelize.literal("MONTH FROM donation_date")
          ),
          "month",
        ],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
        [sequelize.fn("COUNT", sequelize.col("id")), "donationCount"],
      ],
      group: [
        sequelize.fn("EXTRACT", sequelize.literal("YEAR FROM donation_date")),
        sequelize.fn("EXTRACT", sequelize.literal("MONTH FROM donation_date")),
      ],
      order: [
        [
          sequelize.fn("EXTRACT", sequelize.literal("YEAR FROM donation_date")),
          "ASC",
        ],
        [
          sequelize.fn(
            "EXTRACT",
            sequelize.literal("MONTH FROM donation_date")
          ),
          "ASC",
        ],
      ],
      raw: true,
    });

    // Format the data
    const formattedMonthlyDonations = (monthlyDonations || []).map(
      (donation) => {
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return {
          year: donation.year,
          month: donation.month,
          monthName: monthNames[parseInt(donation.month) - 1] || "Unknown",
          totalAmount: parseFloat(donation.totalAmount) || 0,
          donationCount: parseInt(donation.donationCount) || 0,
        };
      }
    );

    return {
      success: true,
      data: formattedMonthlyDonations,
    };
  } catch (error) {
    console.error("Error fetching monthly donations:", error);
    return {
      success: false,
      error: "Failed to fetch monthly donations",
      details: error.message,
    };
  }
};

exports.getDonorsByGovernorate = async () => {
  try {
    // Get counts only where governorate_id is NOT null
    const counts = await Donor.findAll({
      where: {
        governorate_id: {
          [sequelize.Op.ne]: null,
        },
      },
      attributes: [
        "governorate_id",
        [sequelize.fn("COUNT", sequelize.col("id")), "donorCount"],
      ],
      group: ["governorate_id"],
      raw: true,
    });

    // Get all governorates
    const governorates = await ReferenceData.findAll({
      where: { type: "governate" },
      attributes: ["id", "value"],
      raw: true,
    });

    // Combine and return only those with a matching governorate
    const formattedDonorsByGovernorate = counts
      .map((item) => {
        const gov = governorates.find((g) => g.id === item.governorate_id);
        if (!gov) return null; // Skip if no matching governorate found
        return {
          governorate: gov.value,
          donorCount: parseInt(item.donorCount) || 0,
        };
      })
      .filter(Boolean) // Remove nulls
      .sort((a, b) => b.donorCount - a.donorCount);

    return {
      success: true,
      data: formattedDonorsByGovernorate,
    };
  } catch (error) {
    console.error("Error fetching donors by governorate:", error);
    return {
      success: false,
      error: "Failed to fetch donors by governorate",
      details: error.message,
    };
  }
};

exports.getTopProjectsByDonations = async (limit = 5) => {
  try {
    const topProjects = await Project.findAll({
      attributes: [
        "id",
        "project_name",
        [
          sequelize.literal(
            '(SELECT COALESCE(SUM(amount), 0) FROM donations WHERE donations.project_id = "Project".id)'
          ),
          "totalDonations",
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(id) FROM donations WHERE donations.project_id = "Project".id)'
          ),
          "donationCount",
        ],
      ],
      order: [
        [
          sequelize.literal(
            '(SELECT COALESCE(SUM(amount), 0) FROM donations WHERE donations.project_id = "Project".id)'
          ),
          "DESC",
        ],
      ],
      limit: parseInt(limit),
      raw: true,
    });

    return {
      success: true,
      data: topProjects.map((project) => ({
        id: project.id,
        projectName: project.project_name,
        totalDonations: parseFloat(project.totalDonations) || 0,
        donationCount: parseInt(project.donationCount) || 0,
      })),
    };
  } catch (error) {
    console.error("Error fetching top projects:", error);
    return {
      success: false,
      error: "Failed to fetch top projects",
      details: error.message,
    };
  }
};

exports.getRecentDonations = async (limit = 5) => {
  try {
    const recentDonations = await Donation.findAll({
      attributes: ["id", "amount", "donation_date", "created_at"],
      include: [
        {
          model: Donor,
          as: "donor",
          attributes: ["first_name", "last_name"],
        },
        {
          model: Project,
          as: "project",
          attributes: ["project_name"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      raw: true,
      nest: true,
    });

    const formattedDonations = recentDonations.map((donation) => ({
      id: donation.id,
      donorName: `${donation.donor.first_name} ${donation.donor.last_name}`,

      projectName: donation.project.project_name,
      amount: donation.amount,
      donationTimeAgo: dayjs(donation.donation_date).fromNow(), // 👈 relative time here
    }));

    return {
      success: true,
      data: formattedDonations,
    };
  } catch (error) {
    console.error("Error fetching recent donations:", error);
    return {
      success: false,
      error: "Failed to fetch recent donations",
      details: error.message,
    };
  }
};

exports.getUserDetails = async () => {
  const users = await Auth.findAll({
    attributes: ["id", "email", "user_status", "role"],
    include: [
      {
        model: Role,
        attributes: ["role_name"],
        as: "roleDetail",
      },
      {
        model: User,
        attributes: ["user_name", "phone"],
        as: "user",
      },
    ],
    raw: true,
  });

  // Flatten the result to a simple list with desired keys
  return users.map((user) => ({
    id: user.id,
    email: user.email,
    user_status: user.user_status,
    role_name: user["roleDetail.role_name"],
    role_id: user.role,
    user_name: user["user.user_name"],
    phone: user["user.phone"],
  }));
};

exports.updateUserData = async (id, userData) => {
  const { email, user_name, phone, role_id } = userData;

  // Update auth table
  await Auth.update({ email, role_id }, { where: { id } });

  // Update users table
  await User.update({ user_name, phone }, { where: { id } });

  return { message: "User data updated successfully." };
};

exports.updateUserStatus = async (id, user_status) => {
  await Auth.update({ user_status }, { where: { id } });
  return { message: "User status updated successfully." };
};

exports.getAllDonors = async () => {
  const donors = await Donor.findAll({
    include: [
      {
        model: ReferenceData,
        as: "governorateDetail",
        attributes: ["value"],
      },
      {
        model: ReferenceData,
        as: "genderDetail",
        attributes: ["value"],
      },
    ],
    attributes: [
      "id",
      "first_name",
      "middle_name",
      "last_name",
      "birth_date",
      "gender_id",
      "address",
      "governorate_id",
    ],
    raw: true,
    nest: true,
  });

  const formatted = donors.map((donor) => {
    const { governorateDetail, genderDetail, ...rest } = donor;
    return {
      ...rest,
      governorate: governorateDetail?.value || null,
      gender: genderDetail?.value || null,
    };
  });

  return formatted;
};

exports.updateDonorProfile = async (donorId, updatedData) => {
  const donor = await Donor.findByPk(donorId);

  if (!donor) {
    throw new Error("Donor not found");
  }

  await donor.update(updatedData);
  return donor;
};

exports.createDonor = async (id, donorData) => {
  const donor = await Donor.create({
    id,
    ...donorData,
  });
  return donor;
};

exports.getAllDonations = async () => {
  try {
    const donations = await Donation.findAll({
      attributes: ["id", "donor_id", "amount", "donation_date"],
      include: [
        {
          model: Project,
          as: "project",
          attributes: [["project_name", "projectName"]], // This maps the DB column to the model attribute
        },
      ],
    });

    return donations.map((donation) => ({
      donation_id: donation.id,
      donor_id: donation.donor_id,
      amount: donation.amount,
      donation_date: donation.donation_date,
      project_name: donation.project.projectName || null,
    }));
  } catch (error) {
    console.error("Error fetching all donations:", error);
    throw error;
  }
};

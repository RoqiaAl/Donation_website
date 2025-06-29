// services/donorService.js
const {
  Donation,
  RecurringDonation,
  ReferenceData,
  Project,
  Donor,
  Auth,
  User,
  Transaction,
} = require("../models");
const { Op, Sequelize } = require("sequelize");

exports.donorDashboardStatistics = async (donorId) => {
  try {
    // Get all donations by donor
    const donations = await Donation.findAll({
      where: { donor_id: donorId },
    });

    // Total and average donation amount
    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
    const averageAmount = donations.length ? totalAmount / donations.length : 0;

    // Number of unique projects donated to
    const uniqueProjectIds = [
      ...new Set(donations.map((donation) => donation.project_id)),
    ];
    const numberOfProjects = uniqueProjectIds.length;

    // Get count of recurring donations with status = 4
    const recurringDonationsCount = await RecurringDonation.count({
      where: {
        donor_id: donorId,
        recurring_donation_status: 4, // use correct column name from your DB
      },
    });

    return {
      totalAmount,
      averageAmount,
      numberOfProjects,
      recurringDonationsCount,
    };
  } catch (error) {
    throw new Error(
      "Failed to compute donor dashboard statistics: " + error.message
    );
  }
};

exports.donationsAndCharts = async (donorId) => {
  try {
    const donations = await Donation.findAll({
      where: { donor_id: donorId },
      include: {
        model: Project,
        as: "project",
        attributes: ["projectName", "governate"],
      },
      attributes: ["amount", "donation_date"],
      raw: true,
      nest: true,
    });

    // Format and flatten the result
    const formatted = donations.map((d) => ({
      amount: d.amount,
      donation_date: d.donation_date.toISOString().split("T")[0],
      projectName: d.project.projectName,
      governate: d.project.governate,
    }));

    return formatted;
  } catch (error) {
    throw error;
  }
};

// 3. Get Donor Full Profile
exports.getDonorProfile = async (donorId) => {
  const donor = await Donor.findOne({
    where: { id: donorId },
    include: [
      {
        model: Auth,
        attributes: ["email"],
      },
      {
        model: User,
        attributes: ["user_name", "phone"],
      },
    ],
    attributes: [
      "first_name",
      "middle_name",
      "last_name",
      "birth_date",
      "gender_id",
      "address",
      "governorate_id",
    ],
  });

  return donor;
};

// 4. Update Donor Full Profile
exports.updateDonorProfile = async (donorId, data) => {
  const transaction = await Donor.sequelize.transaction();
  try {
    await Auth.update(
      { email: data.email },
      { where: { id: donorId }, transaction }
    );

    await User.update(
      { user_name: data.user_name, phone: data.phone },
      { where: { id: donorId }, transaction }
    );

    // Validate birth_date
    let birthDate = null;
    if (data.birth_date) {
      const parsedDate = new Date(data.birth_date);
      if (!isNaN(parsedDate.getTime())) {
        birthDate = parsedDate;
      }
    }

    await Donor.update(
      {
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        birth_date: birthDate,
        gender_id: data.gender_id,
        address: data.address,
        governorate_id: data.governorate_id,
      },
      { where: { id: donorId }, transaction }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.getRecurringDonationDetails = async (donorId) => {
  try {
    const donations = await RecurringDonation.findAll({
      where: { donorId: donorId },
      attributes: [
        "id", // Include the recurring donation ID
        [Sequelize.fn("DATE", Sequelize.col("start_date")), "startDate"],
        [Sequelize.fn("DATE", Sequelize.col("end_date")), "endDate"],
        [
          Sequelize.fn("DATE", Sequelize.col("next_donation_date")),
          "nextDonationDate",
        ],
        "intervalAmount",
      ],
      include: [
        {
          model: ReferenceData,
          as: "intervalTypeDetail",
          attributes: ["value"],
        },
        {
          model: ReferenceData,
          as: "paymentMethodDetail",
          attributes: ["value"],
        },
        {
          model: ReferenceData,
          as: "statusDetail",
          attributes: ["value"],
        },
      ],
    });

    return donations.map((donation) => ({
      id: donation.id,
      start_date: donation.startDate,
      end_date: donation.endDate,
      interval_amount: donation.intervalAmount,
      interval_type: donation.intervalTypeDetail?.value,
      payment_method: donation.paymentMethodDetail?.value,
      recurring_donation_status: donation.statusDetail?.value,
      next_donation_date: donation.nextDonationDate,
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateRecurringDonationStatus = async (donationId, newStatusId) => {
  try {
    const donation = await RecurringDonation.findByPk(donationId);

    if (!donation) {
      throw new Error("Recurring donation not found.");
    }

    donation.recurringDonationStatus = newStatusId;
    await donation.save();

    return donation;
  } catch (error) {
    throw error;
  }
};

exports.getTransactionsByDonor = async (donorId) => {
  const transactions = await Transaction.findAll({
    include: [
      {
        model: Donation,
        as: "donation",
        where: { donor_id: donorId },
        attributes: [], // We only need donor_id for filtering
      },
      {
        model: ReferenceData,
        as: "paymentMethod",
        attributes: ["value"], // Payment method name
      },
    ],
    attributes: ["donation_id", "transaction_code", "payment_status"],
  });

  return transactions.map((tx) => ({
    donation_id: tx.donation_id,
    transaction_code: tx.transaction_code,
    payment_method: tx.paymentMethod ? tx.paymentMethod.value : null,
    status: tx.payment_status === 1 ? "Success" : "Failed",
  }));
};

exports.getDonorDonations = async (donorId) => {
  try {
    const donations = await Donation.findAll({
      where: { donor_id: donorId },
      attributes: ["id", "amount", "donation_date"],
      include: [
        {
          model: Project,
          as: "project",
          attributes: ["project_name"], // Fetch project name
        },
      ],
    });

    return donations.map((donation) => ({
      donation_id: donation.id,
      amount: donation.amount,
      donation_date: donation.donation_date,
      project_name: donation.project?.project_name || null,
    }));
  } catch (error) {
    console.error("Error fetching donor donations:", error);
    throw error;
  }
};

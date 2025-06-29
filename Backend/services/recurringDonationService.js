const { RecurringDonation, Donor, ReferenceData } = require("../models");
const Sequelize = require("sequelize");

class RecurringDonationService {
  async getAllRecurringDonations() {
    try {
      const donations = await RecurringDonation.findAll({
        attributes: [
          "id",
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
  }

  // Get recurring donation by ID
  async getRecurringDonationById(id) {
    return await RecurringDonation.findByPk(id, {
      include: [{ model: Donor, as: "donor" }],
    });
  }

  // Get recurring donations by Donor ID
  async getRecurringDonationsByDonorId(donorId) {
    return await RecurringDonation.findAll({
      where: { donor_id: donorId },
      include: [{ model: Donor, as: "donor" }],
    });
  }

  // Create a new recurring donation
  async createRecurringDonation(data) {
    return await RecurringDonation.create(data);
  }

  // Update a recurring donation
  async updateRecurringDonation(id, updatedData) {
    const recurringDonation = await RecurringDonation.findByPk(id);
    if (!recurringDonation) throw new Error("Recurring Donation not found");

    await recurringDonation.update(updatedData);
    return recurringDonation;
  }

  // Delete a recurring donation
  async deleteRecurringDonation(id) {
    const recurringDonation = await RecurringDonation.findByPk(id);
    if (!recurringDonation) throw new Error("Recurring Donation not found");

    await recurringDonation.destroy();
    return { message: "Recurring Donation deleted successfully" };
  }

  async updateRecurringDonationStatus(id, status) {
    const recurringDonation = await RecurringDonation.findByPk(id);
    if (!recurringDonation) throw new Error("Recurring Donation not found");

    recurringDonation.status = status;
    await recurringDonation.save();
    return recurringDonation;
  }
}

module.exports = new RecurringDonationService();

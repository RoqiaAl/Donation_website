"use strict";

const cron = require("node-cron");
const { Op } = require("sequelize");
const {
  RecurringDonation,
  Donation,
  Transaction,
  sequelize,
} = require("../models"); // adjust the path if needed
const {
  mockPaymentProcessing,
} = require("../services/donationService"); // adjust path if needed
const { v4: uuidv4 } = require("uuid");

// Your calculateNextDonationDate function (or import it if defined elsewhere)
/**
 * Calculates the next donation date.
 * Always adds exactly one period, ignoring the `intervel_amount` parameter.
 */
function calculateNextDonationDate(
  start_date,
  intervel_type /*, intervel_amount */
) {
  const d = new Date(start_date);

  switch (intervel_type) {
    case 1: // Weekly
      return new Date(d.getTime() + 1 * 7 * 24 * 60 * 60 * 1000);
    case 2: // Monthly
      d.setMonth(d.getMonth() + 1);
      return d;
    case 3: // Annually
      d.setFullYear(d.getFullYear() + 1);
      return d;
    default:
      throw new Error(
        "Invalid intervel_type. Must be 1 (Weekly), 2 (Monthly), or 3 (Annually)."
      );
  }
}

// Schedule the job to run every minute (adjust the schedule as needed)
cron.schedule("* * * * *", async () => {
  console.log("Running recurring donation job at", new Date());
  try {
    // Find all recurring donations that are due
    const dueRecurringDonations = await RecurringDonation.findAll({
      where: {
        next_donation_date: { [Op.lte]: new Date() },
        recurring_donation_status: 4, // assuming 1 indicates active recurring donation
      },
    });

    console.log(
      `Found ${dueRecurringDonations.length} recurring donations due for processing.`
    );

    for (const rd of dueRecurringDonations) {
      // Process each donation in a separate transaction
      await sequelize.transaction(async (t) => {
        // Create a new donation record
        const donationRecord = await Donation.create(
          {
            donor_id: rd.donor_id,
            project_id: rd.project_id,
            amount: rd.amount, // if amount is stored in recurring donation record
            donation_date: new Date(),
          },
          { transaction: t }
        );

        // Process payment (mock)
        const paymentResult = await mockPaymentProcessing(
          rd.payment_method,
          {}
        );
        if (!paymentResult.success) {
          throw new Error("Payment processing failed.");
        }

        // Create a transaction record
        await Transaction.create(
          {
            donation_id: donationRecord.id,
            payment_method: rd.payment_method,
            transaction_code: uuidv4(),
            payment_status: paymentResult.paymentStatus,
          },
          { transaction: t }
        );

        // Update the recurring donation's next_donation_date
        const newNextDonationDate = calculateNextDonationDate(
          rd.start_date,
          rd.intervel_type,
          rd.intervel_amount
        );
        rd.next_donation_date = newNextDonationDate;
        await rd.save({ transaction: t });
      });
      console.log(`Processed recurring donation for donor_id ${rd.donor_id}`);
    }
  } catch (error) {
    console.error("Error processing recurring donations:", error);
  }
});

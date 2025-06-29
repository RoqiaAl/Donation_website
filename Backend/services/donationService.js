"use strict";
const { sendEmail } = require("../utils/emailUtils");
const {
  Auth,
  User,
  Donor,
  Donation,
  Transaction,
  RecurringDonation,
  sequelize,
} = require("../models");
const { v4: uuidv4 } = require("uuid");

const GENERAL_PROJECT_ID = 1;
const DEFAULT_ROLE = 1;

/**
 * Calculates the next donation date.
 * Always adds exactly one period, ignoring the `intervel_amount` parameter.
 */
function calculateNextDonationDate(start_date, intervel_type) {
  const d = new Date(start_date);

  switch (intervel_type) {
    case 1: // Weekly
      return new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000);
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

/**
 * Finds or updates donor by email. Creates new if none found.
 */
async function findOrUpdateDonor(
  email,
  phone,
  user_name,
  governorate_id,
  transaction
) {
  let authRecord = await Auth.findOne({ where: { email } }, { transaction });
  let userRecord, donorRecord;

  if (authRecord) {
    userRecord = await User.findOne(
      { where: { id: authRecord.id } },
      { transaction }
    );
    donorRecord = await Donor.findOne(
      { where: { id: userRecord.id } },
      { transaction }
    );

    if (phone && phone !== userRecord.phone) {
      userRecord.phone = phone;
      await userRecord.save({ transaction });
    }
    if (user_name && user_name !== userRecord.user_name) {
      userRecord.user_name = user_name;
      await userRecord.save({ transaction });
    }
    if (governorate_id && governorate_id !== donorRecord.governorate_id) {
      donorRecord.governorate_id = governorate_id;
      await donorRecord.save({ transaction });
    }
  } else {
    authRecord = await Auth.create(
      { email, user_status: 1, role: DEFAULT_ROLE },
      { transaction }
    );
    userRecord = await User.create(
      { id: authRecord.id, phone: phone || null, user_name },
      { transaction }
    );
    donorRecord = await Donor.create(
      { id: userRecord.id, governorate_id },
      { transaction }
    );
  }

  return { authRecord, userRecord, donorRecord };
}

/**
 * Mock payment function.
 */
async function mockPaymentProcessing(paymentMethod, paymentData) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    success: true,
    transactionCode: uuidv4(),
    paymentStatus: paymentData.paymentStatus || 1,
  };
}

/**
 * Sends an email if the transaction is successful.
 */
async function sendTransactionSuccessEmail(email, amount) {
  await sendEmail({
    to: email,
    subject: "Donation Transaction Successful",
    text: `Dear donor,

Thank you for your generous donation of $${amount}. Your transaction was processed successfully!

Best regards,
Your Donation Team`,
  });
  console.log("Success email sent to:", email);
}

class DonationProcessService {
  /**
   * One-time donation flow.
   */
  async oneTimeDonation(donationData) {
    console.log("⇢ onceDonation payload", donationData);

    const {
      email,
      phone,
      user_name,
      governorate_id,
      amount,
      paymentMethod,
      project_id,
    } = donationData;

    const missing = [];
    if (!email) missing.push("email");
    if (!user_name) missing.push("user_name");
    if (!governorate_id) missing.push("governorate_id");
    if (!amount) missing.push("amount");
    if (!paymentMethod) missing.push("paymentMethod");
    if (missing.length) {
      console.error("Missing fields:", missing.join(", "));
      throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }

    const t = await sequelize.transaction();
    let transactionRecord;
    try {
      const { donorRecord } = await findOrUpdateDonor(
        email,
        phone,
        user_name,
        governorate_id,
        t
      );

      const donationRecord = await Donation.create(
        {
          donor_id: donorRecord.id,
          project_id: project_id || GENERAL_PROJECT_ID,
          amount,
          donation_date: new Date(),
        },
        { transaction: t }
      );

      const paymentResult = await mockPaymentProcessing(paymentMethod, {});
      if (!paymentResult.success) throw new Error("Payment processing failed.");

      transactionRecord = await Transaction.create(
        {
          donation_id: donationRecord.id,
          payment_method: paymentMethod,
          transaction_code: paymentResult.transactionCode,
          payment_status: paymentResult.paymentStatus,
        },
        { transaction: t }
      );

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }

    // fire-and-forget email
    try {
      await sendTransactionSuccessEmail(email, amount);
    } catch (e) {
      console.error("Error sending transaction success email:", e);
    }

    return {
      success: true,
      message:
        `Donation processed successfully! Your transaction code is ${transactionRecord.transaction_code}. ` +
        `It’s important to create an account if you’d like to manage your donations and profile.`,
      transaction: transactionRecord.get({ plain: true }),
    };
  }

  /**
   * Recurring Donation: Create a donation schedule record.
   */
  async recurringDonation(donationData) {
    console.log("⇢ recurringDonation payload", donationData);

    const {
      email,
      phone,
      user_name,
      governorate_id,
      paymentMethod,
      start_date,
      end_date,
      intervel_type,
      intervel_amount,
      recurringDonationStatus,
      project_id,
    } = donationData;

    const missing = [];
    if (!email) missing.push("email");
    if (!user_name) missing.push("user_name");
    if (!governorate_id) missing.push("governorate_id");
    if (!paymentMethod) missing.push("paymentMethod");
    if (!start_date) missing.push("start_date");
    if (!end_date) missing.push("end_date");
    if (!intervel_type) missing.push("intervel_type");
    if (!intervel_amount) missing.push("intervel_amount");
    if (missing.length) {
      console.error("Missing fields:", missing.join(", "));
      throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }

    const nextDonationDate = calculateNextDonationDate(
      start_date,
      intervel_type
    );

    const t = await sequelize.transaction();
    try {
      const { donorRecord } = await findOrUpdateDonor(
        email,
        phone,
        user_name,
        governorate_id,
        t
      );

      await RecurringDonation.create(
        {
          donorId: donorRecord.id,
          projectId: project_id || GENERAL_PROJECT_ID,
          startDate: start_date,
          endDate: end_date,
          intervalType: intervel_type,
          intervalAmount: intervel_amount,
          nextDonationDate,
          paymentMethod,
          recurringDonationStatus: recurringDonationStatus ?? 4,
        },
        { transaction: t }
      );

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }

    try {
      await sendTransactionSuccessEmail(email, intervel_amount);
    } catch (e) {
      console.error("Error sending recurring donation success email:", e);
    }

    return {
      success: true,
      message:
        `Recurring donation set up successfully! Next payment on ${
          nextDonationDate.toISOString().split("T")[0]
        }. ` +
        `It’s important to create an account if you’d like to manage your recurring donations and profile.`,
    };
  }

  async oneTimeDonationWithAccount(donationData, userPayload) {
    const { amount, paymentMethod, project_id } = donationData;
    if (!amount || !paymentMethod) {
      throw new Error("Missing required fields: amount, paymentMethod");
    }

    // 1️⃣ Start a transaction
    const t = await sequelize.transaction();
    let transactionRecord;
    try {
      // 2️⃣ Lookup Donor record by userPayload.id
      const donorRecord = await Donor.findOne(
        {
          where: { id: userPayload.id },
        },
        { transaction: t }
      );

      if (!donorRecord) {
        throw new Error("No donor profile found for this user");
      }

      // 3️⃣ Create the Donation
      const donationRecord = await Donation.create(
        {
          donor_id: donorRecord.id,
          project_id: project_id || GENERAL_PROJECT_ID,
          amount,
          donation_date: new Date(),
        },
        { transaction: t }
      );

      // 4️⃣ Process payment
      const paymentResult = await mockPaymentProcessing(paymentMethod, {});
      if (!paymentResult.success) throw new Error("Payment failed");

      // 5️⃣ Record the Transaction
      transactionRecord = await Transaction.create(
        {
          donation_id: donationRecord.id,
          payment_method: paymentMethod,
          transaction_code: paymentResult.transactionCode,
          payment_status: paymentResult.paymentStatus,
        },
        { transaction: t }
      );

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }

    // 6️⃣ Fire-and-forget email
    sendTransactionSuccessEmail(userPayload.email, amount).catch(console.error);

    return {
      success: true,
      message: `Donation successful! Transaction code: ${transactionRecord.transaction_code}`,
      transaction: transactionRecord.get({ plain: true }),
    };
  }

  /**
   * Recurring donation for logged-in users.
   */
  async recurringDonationWithAccount(donationData, userPayload) {
    const {
      paymentMethod,
      start_date,
      end_date,
      intervel_type,
      intervel_amount,
      project_id,
    } = donationData;

    // validate missing…
    // calculate nextDonationDate…
    const nextDonationDate = calculateNextDonationDate(
      start_date,
      intervel_type
    );

    const t = await sequelize.transaction();
    try {
      const donorRecord = await Donor.findOne(
        {
          where: { id: userPayload.id },
        },
        { transaction: t }
      );
      if (!donorRecord) throw new Error("No donor profile found");

      if (
        !paymentMethod ||
        !start_date ||
        !end_date ||
        !intervel_type ||
        !intervel_amount
      ) {
        throw new Error(
          "Missing required fields: paymentMethod, start_date, end_date, intervel_type, intervel_amount"
        );
      }

      await RecurringDonation.create(
        {
          donorId: donorRecord.id,
          projectId: project_id || GENERAL_PROJECT_ID,
          startDate: start_date,
          endDate: end_date,
          intervalType: intervel_type,
          intervalAmount: intervel_amount,
          nextDonationDate,
          paymentMethod,
          recurringDonationStatus: donationData.recurringDonationStatus ?? 4,
        },
        { transaction: t }
      );

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }

    sendTransactionSuccessEmail(userPayload.email, intervel_amount).catch(
      console.error
    );

    return {
      success: true,
      message: `Recurring donation scheduled! Next payment on ${nextDonationDate
        .toISOString()
        .slice(0, 10)}.`,
    };
  }
  /** Utility: get donor info by email */
  async getDonorInfoByEmail(email) {
    const authRecord = await Auth.findOne({ where: { email } });
    if (!authRecord) return null;

    const userRecord = await User.findOne({
      where: { id: authRecord.id },
    });
    if (!userRecord) return null;

    const donorRecord = await Donor.findOne({
      where: { id: userRecord.id },
    });
    if (!donorRecord) return null;

    return {
      email: authRecord.email,
      phone: userRecord.phone,
      user_name: userRecord.user_name,
      governorate_id: donorRecord.governorate_id,
    };
  }
}

module.exports = new DonationProcessService();

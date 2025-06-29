const { Transaction, Donation, Donor,ReferenceData } = require("../models");

class TransactionService {
  // Get all transactions
  async getAllTransactions() {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: Donation,
          as: "donation",
          attributes: [], // No donation data needed for now
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
  }

  // Get transaction by ID
  async getTransactionById(transactionId) {
    return await Transaction.findByPk(transactionId, {
      include: [{ model: Donation, as: "donation" }],
    });
  }

  // Get transactions by donor ID
  async getTransactionsByDonorId(donorId) {
    return await Transaction.findAll({
      include: [
        {
          model: Donation,
          as: "donation",
          include: [{ model: Donor, as: "donor", where: { id: donorId } }],
        },
      ],
    });
  }

  // Get transactions by donation ID
  async getTransactionsByDonationId(donationId) {
    return await Transaction.findAll({
      where: { donation_id: donationId },
      include: [{ model: Donation, as: "donation" }],
    });
  }

  // Update a transaction
  async updateTransaction(transactionId, updatedData) {
    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction) throw new Error("Transaction not found");

    await transaction.update(updatedData);
    return transaction;
  }

  // Delete a transaction
  async deleteTransaction(transactionId) {
    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction) throw new Error("Transaction not found");

    await transaction.destroy();
    return { message: "Transaction deleted successfully" };
  }
}

module.exports = new TransactionService();

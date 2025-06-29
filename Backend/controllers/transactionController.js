const transactionService = require("../services/transactionService");

class TransactionController {
  // Get all transactions
  async getAll(req, res) {
    try {
      const transactions = await transactionService.getAllTransactions();
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get transaction by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const transaction = await transactionService.getTransactionById(id);
      if (!transaction)
        return res.status(404).json({ error: "Transaction not found" });

      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get transactions by donor ID
  async getByDonorId(req, res) {
    try {
      const { donorId } = req.params;
      const transactions = await transactionService.getTransactionsByDonorId(
        donorId
      );
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get transactions by donation ID
  async getByDonationId(req, res) {
    try {
      const { donationId } = req.params;
      const transactions = await transactionService.getTransactionsByDonationId(
        donationId
      );
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update a transaction
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedTransaction = await transactionService.updateTransaction(
        id,
        req.body
      );
      res.status(200).json(updatedTransaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete a transaction
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await transactionService.deleteTransaction(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

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
}

module.exports = new TransactionController();

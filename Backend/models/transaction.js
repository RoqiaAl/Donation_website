"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Define associations for Transaction.
     * This method is called automatically by models/index.js.
     */
    static associate(models) {
      // Each transaction belongs to a single donation.
      Transaction.belongsTo(models.Donation, {
        foreignKey: "donation_id",
        as: "donation",
      });

      // Payment Method association (Ensure it only fetches 'payment_method' category)
      Transaction.belongsTo(models.ReferenceData, {
        foreignKey: "payment_method",
        as: "paymentMethod",
        scope: { type: "payment_method" },
      });
    }
  }

  Transaction.init(
    {
      donation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transaction_code: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "transactions",
      underscored: true, // Ensure automatically managed fields use snake_case (created_at, updated_at)
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Transaction;
};

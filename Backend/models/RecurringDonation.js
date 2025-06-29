// models/recurringDonation.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RecurringDonation extends Model {
    static associate(models) {
      // Each recurring donation belongs to a donor.
      RecurringDonation.belongsTo(models.Donor, {
        foreignKey: "donor_id",
        as: "donor",
      });

      // Interval type reference - fix the typo in foreignKey
      RecurringDonation.belongsTo(models.ReferenceData, {
        foreignKey: "intervalType", // JavaScript attribute name
        targetKey: "id",
        as: "intervalTypeDetail",
        scope: { type: "interval_type" }, // Note: changed from 'intervel_type'
      });

      // Payment method reference
      RecurringDonation.belongsTo(models.ReferenceData, {
        foreignKey: "paymentMethod", // Use the model attribute name
        as: "paymentMethodDetail",
        scope: { type: "payment_method" },
      });

      // Recurring donation status reference
      RecurringDonation.belongsTo(models.ReferenceData, {
        foreignKey: "recurringDonationStatus", // Use the model attribute name
        as: "statusDetail",
        scope: { type: "recurring_donation_status" },
      });
    }
  }

  RecurringDonation.init(
    {
      donorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "donor_id",
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "start_date",
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "end_date",
      },
      intervalAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        field: "intervel_amount",
      },
      nextDonationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "next_donation_date",
      },
      intervalType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "intervel_type",
      },
      paymentMethod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "payment_method",
      },
      recurringDonationStatus: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "recurring_donation_status",
      },
    },
    {
      sequelize,
      modelName: "RecurringDonation",
      tableName: "recurring_donations",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return RecurringDonation;
};

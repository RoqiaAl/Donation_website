"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ReferenceData extends Model {
    static associate(models) {
      // Payment Method Association
      ReferenceData.hasMany(models.Transaction, {
        foreignKey: "payment_method",
        as: "paymentMethods",
      });
      ReferenceData.hasMany(models.RecurringDonation, {
        foreignKey: "payment_method",
        as: "recurringPaymentMethods",
      });

      // Payment Status Association

      // Recurring Donation Status Association
      ReferenceData.hasMany(models.RecurringDonation, {
        foreignKey: "recurring_donation_status",
        as: "recurringDonationStatuses",
      });

      // Interval Type Association
      ReferenceData.hasMany(models.RecurringDonation, {
        foreignKey: "intervel_type",
        as: "intervalTypes",
      });

      // Donor Gender Association
      ReferenceData.hasMany(models.Donor, {
        foreignKey: "gender_id",
        as: "donorGenders",
      });
      ReferenceData.hasMany(models.Donor, {
        foreignKey: "governorate_id",
        as: "donorGovernorates",
      });
    }
  }

  ReferenceData.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sort_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "ReferenceData",
      tableName: "reference_data",
      timestamps: true,
      underscored: true,
    }
  );

  return ReferenceData;
};

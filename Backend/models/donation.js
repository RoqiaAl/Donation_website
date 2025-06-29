"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Donation extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      // Each donation belongs to one donor.
      Donation.belongsTo(models.Donor, {
        foreignKey: "donor_id",
        as: "donor",
      });
      // Each donation is associated with one project.
      Donation.belongsTo(models.Project, {
        foreignKey: "project_id",
        as: "project",
      });

      // Optionally, if you have transactions associated with a donation:
      // Donation.hasOne(models.Transaction, { foreignKey: 'donation_id', as: 'transaction' });
    }
  }

  Donation.init(
    {
      donor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      donation_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Donation",
      tableName: "donations",
      underscored: true, // Ensures column names are in snake_case.
      timestamps: true, // This will automatically manage created_at and updated_at
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Donation;
};

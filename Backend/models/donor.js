"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Donor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // A donor belongs to a user.
      // In Donor model
      Donor.belongsTo(models.Auth, { foreignKey: "id" });
      Donor.belongsTo(models.User, { foreignKey: "id" });

      Donor.belongsTo(models.ReferenceData, {
        foreignKey: "gender_id",
        as: "genderDetail",
        scope: { type: "gender" },
      });
      Donor.belongsTo(models.ReferenceData, {
        foreignKey: "governorate_id",
        as: "governorateDetail",
        scope: { type: "governate" },
      });
    }
  }

  Donor.init(
    {
      first_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      middle_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birth_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      gender_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      governorate_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Donor",
      tableName: "donors",
      underscored: true,
      timestamps: true, // Uses created_at and updated_at automatically
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Donor;
};

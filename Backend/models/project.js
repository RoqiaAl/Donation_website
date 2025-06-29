// models/project.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Define associations here if needed, e.g.:
     * static associate(models) {
     *   // e.g. Project.hasMany(models.Donation, { foreignKey: 'project_id' });
     * }
     */
    static associate(models) {
      Project.hasMany(models.Donation, {
        foreignKey: "project_id",
        as: "donations",
      });
    }
  }

  Project.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: false,
      },
      projectName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "project_name",
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      targetAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "target_amount",
      },
      raisedAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "raised_amount",
      },

      governate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      childern: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      adults: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      old: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      chronicPatient: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "chronic_patient",
      },
      weakAmmunity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "weak_ammunity",
      },
      male: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      female: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalBeneficiaries: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "total_beneficiaries",
      },
      vaccineType: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "vaccine_type",
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "updated_at",
      },
    },
    {
      sequelize,
      modelName: "Project",
      tableName: "projects",
      underscored: true,
      timestamps: true,
    }
  );

  return Project;
};

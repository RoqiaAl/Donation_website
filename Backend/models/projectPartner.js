"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProjectPartner extends Model {
    /**
     * Define associations for ProjectPartner.
     * This method is called automatically by models/index.js.
     */
    static associate(models) {
      // Each ProjectPartner record belongs to a Project
      ProjectPartner.belongsTo(models.Project, {
        foreignKey: "project_id",
        as: "project",
      });
      // Each ProjectPartner record belongs to a Partner
      ProjectPartner.belongsTo(models.Partner, {
        foreignKey: "partner_id",
        as: "partner",
      });
    }
  }

  ProjectPartner.init(
    {
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      partner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProjectPartner",
      tableName: "project_partners",
      timestamps: true,
      underscored: true,
    }
  );

  return ProjectPartner;
};

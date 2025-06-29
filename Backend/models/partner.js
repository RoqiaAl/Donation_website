"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Partner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      Partner.hasMany(models.ProjectPartner, {
        foreignKey: "partner_id",
        as: "projectLinks",
      });
    }
  }

  Partner.init(
    {
      partner_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      partner_logo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      partner_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Partner",
      tableName: "partners",
      timestamps: true,
      underscored: true,
    }
  );

  return Partner;
};

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Define associations here.
     * This method is automatically called by the `models/index.js` file.
     */
    static associate(models) {
      Permission.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator",
      });
    }
  }

  Permission.init(
    {
      permission_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Permission",
      tableName: "permissions",
      timestamps: true, // Sequelize will automatically manage createdAt and updatedAt
      createdAt: "created_at", // As defined in migration
      updatedAt: "updated_at",
    }
  );

  return Permission;
};

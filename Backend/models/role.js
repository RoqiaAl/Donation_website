"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {}

  Role.init(
    {
      role_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },

    {
      sequelize,
      modelName: "Role",
      tableName: "roles",
      // Using the timestamps as defined in your migration:
      timestamps: true,
      // The migration uses "createdAt" and "updatedAt" (camelCase)
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Role;
};

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Define associations for the RolePermission model.
     */
    static associate(models) {
      // Although many-to-many relationships are usually defined on the primary models (Role and Permission),
      // you can also define associations here if needed.
      RolePermission.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role",
      });
      RolePermission.belongsTo(models.Permission, {
        foreignKey: "permission_id",
        as: "permission",
      });
    }
  }

  RolePermission.init(
    {
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "RolePermission",
      tableName: "role_permissions",
      timestamps: true,
      createdAt: "created_at", // As defined in migration
      updatedAt: "updated_at",
    }
  );

  return RolePermission;
};

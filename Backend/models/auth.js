"use strict";

module.exports = (sequelize, DataTypes) => {
  const Auth = sequelize.define(
    "Auth",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: true, // Allows null for guest accounts
      },

      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      verification_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      token_expiration: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      reset_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reset_token_expiration: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      totp_secret: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "auth",
      underscored: true,
      timestamps: true, // This will automatically use created_at and updated_at
    }
  );

  Auth.associate = function (models) {
    Auth.belongsTo(models.Role, { foreignKey: "role", as: "roleDetail" });
    Auth.belongsTo(models.User, {
      foreignKey: "id", // This is Auth.id
      targetKey: "id", // This is User.id
      as: "user",
    });
  };

  return Auth;
};

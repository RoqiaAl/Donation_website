"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("auth", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: true, // يسمح بكونه NULL لحسابات الضيوف
      },

      role: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
      },
      user_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      verification_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      token_expiration: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      reset_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reset_token_expiration: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      totp_secret: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("auth");
  },
};

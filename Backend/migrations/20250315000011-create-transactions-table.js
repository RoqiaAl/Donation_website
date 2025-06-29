"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transactions", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      donation_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "donations",
          key: "id",
        },
        allowNull: false,
      },
      transaction_code: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "reference_data", // Reference table
          key: "id", // Reference column
        },
      },
      payment_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable("transactions");
  },
};

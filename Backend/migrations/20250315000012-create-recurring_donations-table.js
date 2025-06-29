"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("recurring_donations", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      donor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "donors",
          key: "id",
        },
      },

      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      intervel_amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      intervel_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "reference_data", // Reference table
          key: "id", // Reference column
        },
      },

      payment_method: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "reference_data", // Reference table
          key: "id", // Reference column
        },
      },

      recurring_donation_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "reference_data", // Reference table
          key: "id", // Reference column
        },
      },
      next_donation_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("recurring_donations");
  },
};

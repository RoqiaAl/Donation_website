"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("projects", {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      project_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      target_amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      raised_amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      governate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      childern: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      adults: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      old: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      chronic_patient: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      weak_ammunity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      male: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      female: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_beneficiaries: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      vaccine_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      status: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("projects");
  },
};

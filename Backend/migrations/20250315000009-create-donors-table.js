"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("donors", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,

        primaryKey: true,
      },

      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      middle_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      birth_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      governorate_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "reference_data",
          key: "id",
        },
      },
      gender_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "reference_data",
          key: "id",
        },
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
    await queryInterface.dropTable("donors");
  },
};

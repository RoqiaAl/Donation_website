"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("project_media", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      project_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "projects",
          key: "id",
        },
        allowNull: false,
      },
      media_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      media_size: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      media_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      media_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // Default to 1 (e.g., 1 for images, 2 for videos)
        defaultValue: 1,
      },
      media_extension: {
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
    await queryInterface.dropTable("project_media");
  },
};

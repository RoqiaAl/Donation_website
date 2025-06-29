'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. (Re-)create the table if it’s missing
    await queryInterface.createTable("reference_data", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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

    // 2. Add unique constraint only if it doesn't already exist
    const [[{ exists }]] = await queryInterface.sequelize.query(
      `SELECT EXISTS(
         SELECT 1
         FROM pg_constraint
         WHERE conname = 'unique_type_value'
       ) AS exists;`
    );

    if (!exists) {
      await queryInterface.addConstraint("reference_data", {
        fields: ["type", "value"],
        type: "unique",
        name: "unique_type_value",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("reference_data");
  },
};

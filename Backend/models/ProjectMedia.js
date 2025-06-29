"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProjectMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index.js` file will call this method automatically.
     */
    static associate(models) {
      // Each ProjectMedia record belongs to a Project
      ProjectMedia.belongsTo(models.Project, {
        foreignKey: "project_id",
        as: "project",
      });
    }
  }

  ProjectMedia.init(
    {
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      media_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      media_size: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      media_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      media_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      media_extension: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      media_type: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "ProjectMedia",
      tableName: "project_media",
      timestamps: true,
      underscored: true,
    }
  );

  return ProjectMedia;
};

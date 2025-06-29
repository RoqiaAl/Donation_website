"use strict";

const fs = require("fs");
const path = require("path");
const process = require("process");
const Sequelize = require("sequelize");
require("dotenv").config(); // If you want to load .env variables
const basename = path.basename(__filename);

// Determine environment (development, test, production)
const env = process.env.NODE_ENV || "development";

// Load config from config.json (or config.js if you prefer)
const config = require(path.join(__dirname, "/../config/config.json"))[env];

const db = {};

let sequelize;

// If "use_env_variable" is defined in config, use that
// else use the standard connection credentials from config
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config, // Spread the remaining config options
    // Optional: You can add logging, dialectOptions, etc. here
    // logging: console.log, // or false to disable
  });
}

// Read all files in the models directory (excluding index.js and test files)
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      !file.includes(".test.js")
    );
  })
  .forEach((file) => {
    // Import each model
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Call associate method on each model if defined
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach Sequelize instance and library to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

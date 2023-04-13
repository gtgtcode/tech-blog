const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const dayjs = require("dayjs");

const sequelize = new Sequelize(
  process.env.DATABASE,
  "root",
  process.env.PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    dialectModule: require("mysql2"),
    logging: false,
  }
);

sequelize.query(`USE ${process.env.DATABASE};`);

// Define the User model
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  { timestamps: false }
);

// Sync the database and create the Users table
sequelize
  .sync()
  .then(() => {
    console.log(
      `[ ${dayjs(new Date().getTime()).format(
        "hh:mm:ssA"
      )} ] Users table created successfully.`
    );
  })
  .catch((error) => {
    console.error(
      `[ ${dayjs(new Date().getTime()).format(
        "hh:mm:ssA"
      )} ] Unable to create Users table:`,
      error
    );
  });

module.exports = { User };

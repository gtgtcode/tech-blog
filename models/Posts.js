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

// Define the Post model
const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
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

// Sync the database and create the Posts table
sequelize
  .sync()
  .then(() => {
    console.log(
      `[ ${dayjs(new Date().getTime()).format(
        "hh:mm:ssA"
      )} ] Posts table created successfully.`
    );
  })
  .catch((error) => {
    console.error(
      `[ ${dayjs(new Date().getTime()).format(
        "hh:mm:ssA"
      )} ] Unable to create Posts table:`,
      error
    );
  });

module.exports = { Post };

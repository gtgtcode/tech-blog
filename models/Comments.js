const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const dayjs = require("dayjs");
const { User } = require("../models/User");

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

// Define the Comment model
const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
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
    createdAtFormat: {
      type: DataTypes.TEXT,
      defaultValue: dayjs().format("MM/DD/YY hh:mmA").toString(),
      allowNull: true,
    },
  },
  { timestamps: false }
);
// Sync the database and create the Comments table
sequelize
  .sync()
  .then(() => {
    console.log(
      `[ ${dayjs(new Date().getTime()).format(
        "hh:mm:ssA"
      )} ] Comments table created successfully.`
    );
  })
  .catch((error) => {
    console.error(
      `[ ${dayjs(new Date().getTime()).format(
        "hh:mm:ssA"
      )} ] Unable to create Comments table:`,
      error
    );
  });

Comment.belongsTo(User, { foreignKey: "author_id", as: "author" });

module.exports = { Comment };

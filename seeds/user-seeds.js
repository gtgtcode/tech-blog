const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
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

User.bulkCreate([
  {
    email: "test1@testemail.com",
    username: "john",
    password: "password123",
    createdAt: new Date(),
  },
  {
    email: "test2@testemail.com",
    username: "jane",
    password: "password123",
    createdAt: new Date(),
  },
  {
    email: "test3@testemail.com",
    username: "mark",
    password: "password123",
    createdAt: new Date(),
  },
])
  .then((users) => {
    console.log(users);
  })
  .catch((error) => {
    console.error(error);
  });

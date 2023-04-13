const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql2");
const app = express();
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { User } = require("./models/User.js");
const { Sequelize, Model, DataTypes } = require("sequelize");

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

async function renderUsers() {
  const users = await User.findAll({});
  console.log(users);
  app.get("/", (req, res) => {
    res.render("index", { users: JSON.stringify(users) });
  });
}

renderUsers();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});

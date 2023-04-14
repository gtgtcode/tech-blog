const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { Post } = require("../models/Posts");
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

Post.destroy({ where: {}, truncate: true }).then(
  Post.bulkCreate([
    {
      author_id: 1,
      title: "First Post",
      content: "This is the first post.",
      createdAt: new Date(),
    },
    {
      author_id: 2,
      title: "Second Post",
      content: "This is the second post.",
      createdAt: new Date(),
    },
    {
      author_id: 3,
      title: "Third Post",
      content: "This is the third post.",
      createdAt: new Date(),
    },
  ])
    .then((posts) => {
      console.log(
        `[ ${dayjs(new Date().getTime()).format(
          "hh:mm:ssA"
        )} ] ${JSON.stringify(posts)}`
      );
    })
    .catch((error) => {
      console.error(
        `[ ${dayjs(new Date().getTime()).format("hh:mm:ssA")} ] ${error}`
      );
    })
);

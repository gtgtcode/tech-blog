const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { Comment } = require("../models/Comments");
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

Comment.destroy({ where: {}, truncate: true }).then(
  Comment.bulkCreate([
    {
      post_id: 1,
      author_id: 1,
      content: "Great post, thanks for sharing!",
      createdAt: new Date(),
      createdAtFormat: dayjs().format("MM/DD/YY hh:mmA"),
    },
    {
      post_id: 2,
      author_id: 2,
      content: "I found this really helpful, thanks!",
      createdAt: new Date(),
      createdAtFormat: dayjs().format("MM/DD/YY hh:mmA"),
    },
    {
      post_id: 3,
      author_id: 3,
      content: "This post could use some more detail.",
      createdAt: new Date(),
      createdAtFormat: dayjs().format("MM/DD/YY hh:mmA"),
    },
  ])
    .then((comments) => {
      console.log(
        `[ ${dayjs(new Date().getTime()).format(
          "hh:mm:ssA"
        )} ] ${JSON.stringify(comments)}`
      );
    })
    .catch((error) => {
      console.error(
        `[ ${dayjs(new Date().getTime()).format("hh:mm:ssA")} ] ${error}`
      );
    })
);

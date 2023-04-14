const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql2");
const app = express();
const path = require("path");
const dayjs = require("dayjs");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { User } = require("./models/User.js");
const { Post } = require("./models/Posts.js");
const { Sequelize } = require("sequelize");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

const headerTemplate = require("./views/header.handlebars");

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
    console.log(
      `[ ${dayjs(new Date().getTime()).format(
        "hh:mm:ssA"
      )} ] Connection has been established successfully.`
    );
  })
  .catch((error) => {
    console.error(
      `[ ${dayjs(new Date().getTime()).format(
        "hh:mm:ssA"
      )} ] Unable to connect to the database:`,
      error
    );
  });

// Create a session store using connect-session-sequelize
const sessionStore = new SequelizeStore({
  db: sequelize,
});

// Configure express-session middleware
app.use(
  session({
    secret: "extremely secret!",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

// Initialize the session store
sessionStore.sync();

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect("/login");
  }
};

// Routes
app.get("/", isAuthenticated, async (req, res) => {
  const posts = await Post.findAll({});
  console.log(
    `[ ${dayjs(new Date().getTime()).format("hh:mm:ssA")} ] Posts fetched.`
  );
  const headerData = { username: req.session.username }; // Example data for the header template
  const headerHtml = headerTemplate(headerData); // Render the header template
  res.render("index", {
    posts: JSON.parse(JSON.stringify(posts)),
    header: headerHtml, // Pass the rendered HTML to the header property
  });
});

app.get("/login", async (req, res) => {
  const users = await User.findAll({});
  res.render("login", { users: JSON.stringify(users) });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username, password } });
  if (user) {
    req.session.userId = user.id;
    req.session.username = req.body.username;
    req.session.isAuthenticated = true;
    console.log(
      `[ ${dayjs(new Date().getTime()).format("hh:mm:ssA")} ] User ${
        req.session.username
      } logged in.`
    );
    res.redirect("/");
  } else {
    res.render("login", {
      error: `Invalid username or password`,
    });
    console.log(
      `[ ${dayjs(new Date().getTime()).format(
        "hh:mm:ssA"
      )} ] Invalid username or password.`
    );
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        `[ ${dayjs(new Date().getTime()).format("hh:mm:ssA")} ] User logged out`
      );
      res.redirect("/login");
    }
  });
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const newUser = await User.create({ email, username, password });
    console.log(
      `[ ${dayjs(new Date().getTime()).format("hh:mm:ssA")} ] User ${
        newUser.username
      } created.`
    );
    res.redirect("/login");
  } catch (error) {
    console.log(
      `[ ${dayjs(new Date().getTime()).format(
        "hh:mm:ssA"
      )} ] Error creating user: ${error.message}`
    );
    res.render("signup", {
      error: `Error creating user: ${error.message}`,
    });
  }
});

app.get("/posts/:id", isAuthenticated, async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  const headerData = { username: req.session.username }; // Example data for the header template
  const headerHtml = headerTemplate(headerData); // Render the header template
  res.render("post", {
    post: JSON.parse(JSON.stringify(post)),
    header: headerHtml, // Pass the rendered HTML to the header property
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(
    `[ ${dayjs(new Date().getTime()).format(
      "hh:mm:ssA"
    )} ] Server running on http://localhost:${port}/`
  );
});

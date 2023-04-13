const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql2");
const app = express();
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { User } = require("./models/User.js");
const { Sequelize } = require("sequelize");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

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
  const users = await User.findAll({});
  res.render("index");
});

app.get("/login", async (req, res) => {
  const users = await User.findAll({});
  res.render("login", { users: JSON.stringify(users) });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username, password } });
  if (user) {
    req.session.username = req.body.username;
    req.session.isAuthenticated = true;
    console.log(`User ${req.session.username} logged in`);
    res.redirect("/");
  } else {
    res.render("login", { error: "Invalid username or password" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`User logged out`);
      res.redirect("/login");
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});

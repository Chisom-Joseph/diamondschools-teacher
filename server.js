require("dotenv").config();

const express = require("express");
const app = express();
const PORT = 3728 || process.env.PORT;
const db = require("./models");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

const sessionStore =
  process.env.NODE_ENV === "production"
    ? new SequelizeStore({
        db: db.sequelize,
      })
    : new session.MemoryStore();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(cookieParser());
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(require("./routes"));

console.log("Waiting for database connection...");
db.sequelize
  .authenticate()
  .then(async () => {
    console.log(`Database connection successful!`);
    return db.sequelize.sync({ force: false, alter: false });
  })
  .then(() => {
    const config = db.sequelize.config;
    console.table({
      dialect: config.dialect,
      database: config.database,
      database_user: config.username,
      database_host: config.host,
    });
    app.listen(PORT, () => {
      console.log(`Server is Up and Running on http://localhost:${PORT}/`);
    });
  })
  .catch((error) => console.log(error));

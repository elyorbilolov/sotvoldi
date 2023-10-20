const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const Handlebars = require("handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");
const helpers = require("./utils/hbsHelpers");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

const store = new MongoStore({
  collection: "sessions",
  uri: process.env.MONGO_URI,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

helpers(Handlebars);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(flash());
app.use(helmet());
app.use(compression());

app.use(express.static(path.join(__dirname, "public")));

app.engine("hbs", engine({ extname: "hbs" }));
app.set("view engine", "hbs");

app.use("/", require("./routes/homeRoutes"));
app.use("/posters", require("./routes/posterRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/profile", require("./routes/profileRoutes"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

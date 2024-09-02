const express = require("express");
const app = express();
const session = require("express-session");
var cors = require("cors");
var MongoDBStore = require("connect-mongodb-session")(session);
const routes = require("./routes");
const staticDirectory = "src/public/images/jobListingApplication";

// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(express.static(staticDirectory));

// configure the session middleware here

var store = new MongoDBStore({
  uri: "mongodb://localhost:27017/",
  databaseName: "testDB",
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log("MongoDBStore Error:", error);
});
app.use(
  session({
    secret: "3b2902c8ae6ab986a9fa145222251958",
    name: "session_id",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: false,
      httpOnly: true,
      path: "/",
    },
  })
);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Logging middleware to check session data
app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session Data:", req.session);
  console.log("Cookies:", req.cookies);
  console.log("Session Cookie:", req.headers.cookie);
  next();
});

app.use("/v1", routes);
app.get("/check-auth", (req, res) => {
  console.log(req.session);
  if (req.session.userInfo) {
    res.json({
      code: "OK",
      status: false,
      message: "User is Authenticated.",
      data: req.session.userInfo,
    });
  } else {
    res.status(401).json({
      code: "UNAUTHORIZED",
      status: false,
      message: "User is not authenticated.",
    });
  }
});

app.use((req, res, next) => {
  res.status(404).json({
    code: "NOT_FOUND",
    status: false,
    message: "Route Not Found Goballly.",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;

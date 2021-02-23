const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const passport = require("passport");

const app = express();

// logging middleware
app.use(morgan("dev"));

//static middleware
app.use(express.static(path.join(__dirname, "../public")));

//body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "a wildly insecure secret",
    resave: false,
    saveUninitialized: false,
  })
);

// authentication middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", require("./apiRoutes"));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// const port = process.env.PORT || 3000; // this can be very useful if you deploy to Heroku!
// app.listen(port, function () {
//   console.log("Knock, knock");
//   console.log("Who's there?");
//   console.log(`Your server, listening on port ${port}`);
// });

const db = require("./database/index.js");
// and our server that we already created and used as the previous entry point is 'server.js'
// const app = require('');
const port = process.env.PORT || 3000;

db.sync() // sync our database
  .then(function () {
    app.listen(port, function () {
      console.log("Knock, knock");
      console.log("Who's there?");
      console.log(`Your server, listening on port ${port}`);
    }); // then start listening with our express server once we have synced
  });

app.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});

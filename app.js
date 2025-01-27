var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var imageRouter = require("./routes/image-upload");

var app = express();

// We used dotenv to hide database credentials behind a environmental variable, I will replace the reference on line 39 with the correct credential link for marking
require("dotenv").config();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//Using bodyparser to parse json data
app.use(bodyparser.json());
//Cross origin resource sharing middleware
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/", imageRouter);

// Database connection setup

mongoose.connect("mongodb+srv://AIPAdmin:AIP2019@cluster0-m1byc.mongodb.net/aip-project?retryWrites=true&w=majority");

var connection = mongoose.connection;

//Console log to show connection to database successful
connection.once("open", () => {
  console.log("Connection to MongoDB established successfully");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

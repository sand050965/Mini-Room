"use strict";
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const compression = require("compression");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const { connectToDB } = require("../utils/DBUtil");
const meetingRoutes = require("../routes/meetingRoutes");
const premeetingRoutes = require("../routes/premeetingRoutes");
const roomRoutes = require("../routes/roomRoutes");

// view engine setup
const app = express();
app.set("views", path.resolve(__dirname, "../views"));
app.set("view engine", "ejs");

// middlewares
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cors());
app.use(express.static(path.resolve(__dirname, "../public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use("/", meetingRoutes);
app.use("/api/premeeting", premeetingRoutes);
app.use("/api/room", roomRoutes);

// DB connection
connectToDB();

// index page
app.get("/", (req, res) => {
  res.render("index");
});

module.exports = app;
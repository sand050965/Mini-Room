/** @format */

"use strict";
const express = require("express");
const session = require("express-session");
const compression = require("compression");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const meetingRoutes = require("./routes/meetingRoutes");
const participantRoutes = require("./routes/participantRoutes");
const roomRoutes = require("./routes/roomRoutes");
const mailRoutes = require("./routes/mailRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const s3Routes = require("./routes/s3Routes");
const memberRoutes = require("./routes/memberRoutes");
const errorRoutes = require("./routes/errorRoutes");
const thankyouRoutes = require("./routes/thankyouRoutes");

require("dotenv").config();
// require("./middleware/passport")(passport);
// require("https").globalAgent.options.rejectUnauthorized = false;

// view engine setup
const app = express();
app.set("views", path.resolve(__dirname, "./views"));
app.set("view engine", "ejs");

// Sessions
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

// middlewares
app.use(cors());
app.use(express.static(path.resolve(__dirname, "./public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Passport middleware
app.use(passport.initialize());
app.use(passport.authenticate("session"));

app.use("/api/participant", participantRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/s3", s3Routes);
app.use("/api/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/error", errorRoutes);
app.use("/member", memberRoutes);
app.use("/thankyou", thankyouRoutes);
app.use("/", meetingRoutes);

// index page
app.get("/", (req, res) => {
	res.render("index");
});

module.exports = app;

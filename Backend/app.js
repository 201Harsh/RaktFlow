const express = require("express");
const ConnectToDB = require("./config/db");
ConnectToDB();

const app = express();
const UserRouter = require("./routes/user.route");
const cookieParser = require("cookie-parser");

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/users", UserRouter);

module.exports = app;

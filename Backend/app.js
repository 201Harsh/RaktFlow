const express = require("express");

const app = express();
const UserRouter = require("./routes/user.route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", UserRouter);

module.exports = app;

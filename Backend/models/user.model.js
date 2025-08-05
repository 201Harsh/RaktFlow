const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordNotHashed: {
    type: String,
    required: true,
  },
});

userSchema.methods.jwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.static.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const user = mongoose.model("user", userSchema);
module.exports = user;

const userModel = require("../models/user.model");
const { validationResult } = require("express-validator");
const userServices = require("../services/user.services");

module.exports.RegisterUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;

    const IsUser = await userModel.findOne({ username });

    if (IsUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const User = await userServices.CreateUser({
      username,
      password: hashedPassword,
      passwordNotHashed: password,
    });

    const token = User.jwtToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({
      message: "User created successfully",
      User,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports.LoginUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;

    const User = await userModel.findOne({ username });

    if (!User) {
      return res.status(400).json({
        message: "Username or password is incorrect",
      });
    }
    const isMatch = await User.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Username or password is incorrect",
      });
    }

    const token = User.jwtToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({
      message: "User logged in successfully",
      User,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

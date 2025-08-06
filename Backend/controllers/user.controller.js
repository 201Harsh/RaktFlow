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

    res.cookie("token", token, {});

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

    res.cookie("token", token, {});

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

module.exports.GetAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    if (!users) {
      return res.status(400).json({
        message: "No users found",
      });
    }

    res.status(200).json({
      message: "All Users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports.getOneUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports.LogoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
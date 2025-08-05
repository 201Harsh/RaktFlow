const userModel = require("../models/user.model");

module.exports.CreateUser = async ({ username, password, passwordNotHashed }) => {
  if (!username || !password) {
    throw new Error("Username and password are required");
  }
  const user = await userModel.create({ username, password , passwordNotHashed });
  return user;
};

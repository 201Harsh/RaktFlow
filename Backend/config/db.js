const mongoose = require("mongoose");

const ConnectTODB = async () => {
  await mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to MongoDB");
  });
};

module.exports = ConnectTODB;
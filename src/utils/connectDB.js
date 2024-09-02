const mongoose = require("mongoose");
const uri = "mongodb://localhost:27017";

const connectDB = async () => {
  try {
    await mongoose.connect(uri, { dbName: "testDB" });
    console.log("Connected..");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDB;

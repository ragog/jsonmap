const mongoose = require("mongoose");

const dbConnectionURL = process.env.DB_URL || "mongodb://127.0.0.1:27017";
const databasePath = "/restore";

mongoose.connect(dbConnectionURL + databasePath, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true,
});

module.exports = mongoose;

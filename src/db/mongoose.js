const mongoose = require("mongoose");

const dbConnectionURL = process.env.DB_URL || "mongodb://127.0.0.1:27017";
const dbPath = "/restore_db";

mongoose.connect(dbConnectionURL + dbPath, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;

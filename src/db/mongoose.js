const mongoose = require("mongoose");

const dbConnectionURL = process.env.DB_URL || "mongodb://127.0.0.1:27017/admin";

mongoose.connect(dbConnectionURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log('DB connection established')

module.exports = mongoose;

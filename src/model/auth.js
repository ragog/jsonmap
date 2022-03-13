const mongoose = require("mongoose");

const Auth = mongoose.model("Auth", {
  apikey: {
    type: String,
    required: true
  },
});

module.exports = Auth;

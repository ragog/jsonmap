const mongoose = require("mongoose");

const User = mongoose.model("User", {
  id : {
    type: String,
    required: true
  },
  apikey: {
    type: String,
    required: true
  }
});

module.exports = User;

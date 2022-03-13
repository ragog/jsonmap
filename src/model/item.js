const mongoose = require("mongoose");

const Item = mongoose.model("Item", {
  id: {
    type: String,
    required: true,
    default: "unknown",
  },
  body: {
    type: String,
    required: true,
    default: "unknown",
  }, // validate(value){ ... } for custom validation; use together with npm package 'validator'
});

module.exports = Item;

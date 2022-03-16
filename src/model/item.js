const mongoose = require("mongoose");

const Item = mongoose.model("Item", {
  id: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  body: {
    type: Object,
    required: true,
  }, // validate(value){ ... } for custom validation; use together with npm package 'validator'
  owner: {
    type: String,
    required: true
  }
});

module.exports = Item;

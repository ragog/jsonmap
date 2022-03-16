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
  value: {
    type: Object,
    required: true,
  },
  owner: {
    type: String,
    required: true
  }
});

module.exports = Item;

const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  merchantName: {
    type: String,
    required: true,
  },
  discountPercent: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  cashbackExpected: {
    type: Number,
    required: true,
  },
  purchaseDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Purchase", purchaseSchema);

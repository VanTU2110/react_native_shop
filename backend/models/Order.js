const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  recipientName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  cart: [
    {
      productCode: String,
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  totalPrice: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);

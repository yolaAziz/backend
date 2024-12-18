const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
      color: String,
      additionalDetails: String,
    },
  ],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    phone: String,
    notes: String,
  },
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  shippingCost:Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String || Number,
  payerId: String || Number,
  orderId: String || Number,
});

module.exports = mongoose.model("Order", OrderSchema);

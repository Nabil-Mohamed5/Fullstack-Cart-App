const mongoose = require("mongoose");

const orderModel = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: { type: String },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  status: { type: String, required: true, default: "pending" },
});
module.exports = mongoose.model("Order", orderModel);

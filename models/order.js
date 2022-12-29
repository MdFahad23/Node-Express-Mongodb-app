const { Schema, model } = require("mongoose");
const { CartItemSchema } = require("./cartItem");

module.exports.Order = model(
  "Order",
  Schema(
    {
      cartItems: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          price: Number,
          count: {
            type: Number,
            default: 1,
            min: 1,
            max: 5,
          },
          user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
        },
      ],
      transaction_id: {
        type: String,
        unique: true,
      },
      address: {
        phone: String,
        address1: String,
        address2: String,
        city: String,
        state: String,
        postcode: Number,
        country: String,
      },
      status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Complete"],
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      sessionKey: String,
    },
    { timestamps: true }
  )
);

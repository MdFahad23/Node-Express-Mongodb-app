require("dotenv").config();
const PaymentSession = require("ssl-commerz-node").PaymentSession;
const { CartItem } = require("../models/cartItem");
const { Profile } = require("../models/profile");
const { Order } = require("../models/order");
const { Payment } = require("../models/payment");

module.exports.ipn = async (req, res) => {
  let payment = new Payment(req.body);
  let tran_id = payment["tran_id"];
  if (payment["status"] === "VALID") {
    const order = await Order.updateOne(
      { transaction_id: tran_id },
      { status: "Complete" }
    );
    await CartItem.deleteMany(order.cartItems);
  } else {
    await Order.deleteOne({ transaction_id: tran_id });
  }
  await payment.save();
  return res.status(200).send("IPN");
};

module.exports.initPayment = async (req, res) => {
  const userId = req.user._id;
  const cartItem = await CartItem.find({ user: userId });
  const profile = await Profile.findOne({ user: userId });

  const { phone, address1, address2, city, state, postCode, country } = profile;

  const total_amount = cartItem
    .map((item) => item.price * item.count)
    .reduce((a, b) => a + b, 0);

  const tran_id =
    "_" + Math.random().toString(36).substring(2, 9) + new Date().getTime();

  const num_item = cartItem
    .map((item) => item.count)
    .reduce((a, b) => a + b, 0);

  let payment = new PaymentSession(
    true,
    process.env.STORE_ID,
    process.env.STORE_PASSWORD
  );

  // Set the urls
  payment.setUrls({
    success: "yoursite.com/success", // If payment Succeed
    fail: "yoursite.com/fail", // If payment failed
    cancel: "yoursite.com/cancel", // If user cancel payment
    ipn: "https://confused-ox-tux.cyclic.app/api/payment/ipn", // SSLCommerz will send http post request in this link
  });

  // Set order details
  payment.setOrderInfo({
    total_amount: total_amount, // Number field
    currency: "BDT", // Must be three character string
    tran_id: tran_id, // Unique Transaction id
    emi_option: 0, // 1 or 0
  });

  // Set customer info
  payment.setCusInfo({
    name: req.user.name,
    email: req.user.email,
    add1: address1,
    add2: address2,
    city: city,
    state: state,
    postcode: postCode,
    country: country,
    phone: phone,
    fax: phone,
  });

  // Set shipping info
  payment.setShippingInfo({
    method: "Courier", //Shipping method of the order. Example: YES or NO or Courier
    num_item: num_item,
    name: req.user.name,
    add1: address1,
    add2: address2,
    city: city,
    state: state,
    postcode: postCode,
    country: country,
  });

  // Set Product Profile
  payment.setProductInfo({
    product_name: "Computer",
    product_category: "General",
    product_profile: "general",
  });

  let response = await payment.paymentInit();
  let order = new Order({
    cartItems: cartItem,
    user: userId,
    transaction_id: tran_id,
    address: profile,
  });
  if (response.status === "SUCCESS") {
    order.sessionKey = response["sessionkey"];
    await order.save();
  }
  return res.status(200).send(response);
};

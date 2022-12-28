const _ = require("lodash");
const { CartItem } = require("../models/cartItem");

/**
 *
 * @param {*CartItem Created} req
 * @param {*Successfully add item} res
 */
module.exports.createCartItem = async (req, res) => {
  let { price, product } = _.pick(req.body, ["price", "product"]);
  const item = await CartItem.findOne({ user: req.user._id, product: product });
  if (item) return res.status(400).send("Item already exists in Cart!");

  let cartItem = new CartItem({
    product: product,
    price: price,
    user: req.user._id,
  });
  let result = await cartItem.save();

  return res.status(201).send({
    message: "Added to cart Successfully!",
    data: result,
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
module.exports.getCartItem = async (req, res) => {
  let cartItem = await CartItem.find({ user: req.user._id })
    .populate("product", "name")
    .populate("user", "name");

  return res.status(200).send(cartItem);
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
module.exports.updateCartItem = async (req, res) => {
  const { _id, count } = _.pick(req.body, ["_id", "count"]);
  await CartItem.updateOne({ _id: _id, user: req.user._id }, { count: count });
  return res.status(200).send("Item Updated!!");
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
module.exports.delateCartItem = async (req, res) => {
  let _id = req.params.id;
  await CartItem.deleteOne({ _id: _id, user: req.user._id });
  return res.status(200).send("delete!!");
};

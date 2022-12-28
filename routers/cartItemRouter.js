const router = require("express").Router();
const {
  createCartItem,
  getCartItem,
  updateCartItem,
  delateCartItem,
} = require("../controllers/cartItem.Controllers");
const authorize = require("../middlewares/authorize");

router
  .route("/")
  .post(authorize, createCartItem)
  .get(authorize, getCartItem)
  .put(authorize, updateCartItem);

router.route("/:id").delete(authorize, delateCartItem);

module.exports = router;

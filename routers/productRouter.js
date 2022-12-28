const router = require("express").Router();
const {
  createProduct,
  getProductById,
  getProducts,
  updateProductById,
  getPhoto,
  FilterProducts,
} = require("../controllers/product.Controllers");
const authorize = require("../middlewares/authorize");
const admin = require("../middlewares/admin");

router.route("/").post(authorize, admin, createProduct).get(getProducts);

router
  .route("/:id")
  .get(getProductById)
  .put(authorize, admin, updateProductById);

router.route("/photo/:id").get(getPhoto);

router.route("/filter").post(FilterProducts);

module.exports = router;

const router = require("express").Router();
const {
  createCategory,
  getCategorise,
} = require("../controllers/category.Controllers");
const authorize = require("../middlewares/authorize");
const admin = require("../middlewares/admin");

router.route("/").post(authorize, admin, createCategory).get(getCategorise);

module.exports = router;

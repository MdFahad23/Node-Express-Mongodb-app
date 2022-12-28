const router = require("express").Router();
const { initPayment, ipn } = require("../controllers/Payment.Controllers");
const authorize = require("../middlewares/authorize");

router.route("/").get(authorize, initPayment);

router.route("/ipn").post(ipn);

module.exports = router;

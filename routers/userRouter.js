const router = require("express").Router();

const { signUp, signIn } = require("../controllers/user.Controllers.js");

router.route("/signUp").post(signUp);
router.route("/signIn").post(signIn);

module.exports = router;

const router = require("express").Router();
const {
  getProfile,
  setProfile,
} = require("../controllers/profile.Controllers");
const authorize = require("../middlewares/authorize");

router.route("/").get(authorize, getProfile).post(authorize, setProfile);

module.exports = router;

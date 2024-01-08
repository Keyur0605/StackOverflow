const express = require("express");
const router = express.Router();
const Auth = require('../middleware/auth');
const {emailid, otp, newPass} = require("../controllers/forgetPass")

router.route("/email").post(emailid);
router.route("/otp").post(Auth, otp);
router.route("/password").patch(Auth, newPass);

module.exports = router
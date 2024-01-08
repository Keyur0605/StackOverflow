const express = require("express");
const router = express.Router();
const Auth = require("../middleware/auth");
const resetPassword = require('../controllers/resetPass');

router.route("/").patch(Auth, resetPassword);

module.exports = router
const express = require("express");
const router = express.Router();
const addAns = require("../controllers/answer");
const Auth = require("../middleware/auth");

router.route("/").post(Auth, addAns);

module.exports = router
const express = require("express");
const router = express.Router();
const addCommit = require("../controllers/comAnswer");
const Auth = require("../middleware/auth");

router.route("/").post(Auth, addCommit);

module.exports = router
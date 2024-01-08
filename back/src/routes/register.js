const express = require("express");
const router = express.Router();
const createUser = require('../controllers/register');

router.route("/").post(createUser);

module.exports = router
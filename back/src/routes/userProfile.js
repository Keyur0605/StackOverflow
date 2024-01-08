const express = require("express");
const router = express.Router();
const Auth = require("../middleware/auth");
const {getProfile, getProfileByName, updateProfile} = require("../controllers/userProfile");

router.route("/").get(Auth, getProfile);
router.route("/:name").get(Auth, getProfileByName);
router.route("/update").put(Auth, updateProfile);

module.exports = router
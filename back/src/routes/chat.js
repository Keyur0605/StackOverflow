const express = require("express");
const router = express.Router();
const Auth = require("../middleware/auth");
const {getChat, blockAndUnblock, sendUserList} = require("../controllers/chat");

router.route("/:room").get(Auth, getChat);
router.route("/block/:name/:groupname").patch(Auth, blockAndUnblock);
router.route("/userlist/:groupname").get(Auth, sendUserList);

module.exports = router
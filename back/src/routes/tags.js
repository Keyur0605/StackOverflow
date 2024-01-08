const express = require("express");
const router = express.Router();
const {addTag, getTag, getTagName, getTagQuestionList} = require("../controllers/tags");

router.route("/").post(addTag);
router.route("/").get(getTag);
router.route("/name").get(getTagName);
router.route("/:tag/:number").get(getTagQuestionList);

module.exports = router
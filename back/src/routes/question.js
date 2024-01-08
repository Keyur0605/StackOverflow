const express = require("express");
const router = express.Router();
const {addQuestion, getQuestionList, getSearchQuestionList, getQuestion, getUserQuestion} = require("../controllers/question");
const Auth = require("../middleware/auth");

router.route("/add").post(Auth, addQuestion);
router.route("/user").get(Auth, getUserQuestion);
router.route("/list/:number").get(getQuestionList);
router.route("/search/:question/:number").get(getSearchQuestionList);
router.route("/:id").get(getQuestion);

module.exports = router
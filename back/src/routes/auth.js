const express = require("express");
const router = express.Router();
const passport = require("passport");
const {isLoggedIn, callBack, protected, failure, logout} = require("../controllers/auth");

router.route("/").get(passport.authenticate('google', { scope: [ 'email', 'profile' ] }));
router.route("/callback").get(passport.authenticate( 'google', {
    successRedirect: 'http://localhost:3000',
    failureRedirect: '/auth/google/failure'
}));
router.route("/protected").get(isLoggedIn, protected);
router.route("/failure").get(failure);
router.route("/logout").get(logout);

module.exports = router
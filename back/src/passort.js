require("dotenv").config();
const mongoose = require("mongoose");
const Register = require("../src/models/register");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
  // clientID: process.env.GOOGLE_CLIENT_ID,
  clientID: "417421396558-jv6gub0ialn6b3p8iq6s24f3bjfrjs8u.apps.googleusercontent.com",
  // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  clientSecret: "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",
  callbackURL: "http://localhost:8000/auth/google/callback",
  passReqToCallback: true
},
  async function (request, accessToken, refreshToken, profile, done) {
    let userDetails = profile;
    let name = userDetails.displayName;
    let email = userDetails.email;
    let provider = userDetails.provider;
    let picture = userDetails.picture;
    let token = accessToken;
    let data = await Register.find({email});
    if(!data.length>0){
      var data2 = Register({name, email, provider, picture, token});
      await data2.save();
      return done(null, data2);
    }else{
      return done(null, data);
    }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
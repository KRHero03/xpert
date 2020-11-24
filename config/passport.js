const mongoose = require("mongoose");
const User = mongoose.model("user");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {env,dev,production} = require("../config/keys.js");

let keys;
if(env=="dev"){
    keys = dev;
}else{
    keys = production;
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: env=="dev"?"http://localhost:3000/auth/google/callback":"http://localhost:"+process.env.PORT+"5000/auth/google/callback",
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ email: profile.emails[0].value }).then(existingUser => {
        if (existingUser) {
          done(null, existingUser);
        } else {
          new User({
            //googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value.split("?")[0]
          })
            .save()
            .then(user => done(null, user));
        }
      });
    }
  )
);

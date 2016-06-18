// Setup Facebook authentication goes here

var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var FB = require('fb');

module.exports = function(app){
  passport.use(new Strategy({
      clientID: process.env.FB_CLIENT_ID ,
      clientSecret: process.env.FB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'email']
    },
    function(accessToken, refreshToken, profile, cb) {
      FB.setAccessToken(accessToken); // set Access token
      return cb(null, profile);
    }
  ));
  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });
  /* Face Strategy Setup: END */

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'user_photos' })); // Ask user for user_photos permissions

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });

}

var express = require('express');
var router = express.Router();
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var FB = require('fb');

require('dotenv').config();

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

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'user_photos' })); // Ask user for user_photos permissions

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


/* GET home page. */

router.get('/', (req, res) => req.isAuthenticated() ? res.render('index', { user: req.user}) : res.render('login'))

module.exports = router;

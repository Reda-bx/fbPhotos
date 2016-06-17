var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var path = require('path');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var FB = require('fb');

require('dotenv').config();

/* Face Strategy Setup: START */
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

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'user_photos' })); // Ask user for user_photos permissions

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


/* GET home page. */
router.get('/', (req, res) => req.isAuthenticated() ? res.render('index', { user: req.user}) : res.render('login'))
/* Logout */
router.get('/logout', (req, res) => {req.logout(); res.redirect('/')})

/* Fetch All Albums&Images */
router.get('/api/albums', (req, res) => {
  FB.api(
    '/me?fields=albums.fields(id,name,cover_photo,photos.fields(name,picture,source, likes))',
    'GET',
    function (response) {
      response.error ? res.json(response): res.json(response.albums.data) // Hanlde the response if user authenticated or not.
    }
  )
})
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
var creatPath = function (path) {
  // Try to create directory
  try {
    fs.mkdirSync(path);
  } catch(e) {
    // EEXIST means that the directory exists
    if ( e.code != 'EEXIST' ) throw e;
  }
}
router.post('/upload', (req, res) =>{
  // TODO: Save /albums/userId/albumName/pic1,pic2,pic3.....picN
  // Save file by id user (id is unique, displayName not.)
  const dir = './albums';
  const userFolder = req.user.id;
  const albumName = req.body[0].albumName

  creatPath( path.join(dir) );
  creatPath( path.join(dir, userFolder) );
  creatPath( path.join(dir, userFolder, albumName) );
  for(var i=0;i<req.body[0].photos.length;i++){
    // TODO: change image name.
    download(req.body[0].photos[i], './'+dir+'/'+userFolder+'/'+albumName+'/test'+i+'.jpg', function(){
      console.log('done');
    })
  }
  res.send('ij')
})

module.exports = router;

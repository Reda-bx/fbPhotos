var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var path = require('path');
var fbOauth = require('../config/fbOauth')
var FB = require('fb');
var io = require('../model/upload')

require('dotenv').config();

/* Face Strategy Setup: START */

fbOauth(router)
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


// Switching to Socket instead of making request to each selected image (too many http post request may cost lack in memory)
// router.post('/upload', (req, res) =>{
//   // TODO: Save /albums/userId/albumName/pic1,pic2,pic3.....picN
//   // Save file by id user (id is unique, displayName not.)
//   const dir = './albums';
//   const userFolder = req.user.id;
//   const albumName = req.body[0].albumName
//
//   creatPath( path.join(dir) );
//   creatPath( path.join(dir, userFolder) );
//   creatPath( path.join(dir, userFolder, albumName) );
//   for(var i=0;i<req.body[0].photos.length;i++){
//     // TODO: change image name.
//     download(req.body[0].photos[i], './'+dir+'/'+userFolder+'/'+albumName+'/test'+i+'.jpg', function(){
//       console.log('done');
//     })
//   }
//   res.send('ij')
// })

module.exports = router;

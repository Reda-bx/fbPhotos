angular.module('albumsApp', ['ngResource'])
.controller('myAlbumsController', function($scope, apiAlbums){
  var myAlbums = this

  myAlbums.albums = apiAlbums.query();

  myAlbums.albums.$promise.then(function(res){
    myAlbums.albums = res
  })

})

.factory('apiAlbums', function($resource) {
  return  $resource('http://localhost:3000/api/albums');
});

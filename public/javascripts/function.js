angular.module('albumsApp', ['ngResource'])
.controller('myAlbumsController', function($scope, apiAlbums){
  var myAlbums = this
  myAlbums.singleAlbum = []
  myAlbums.albums = apiAlbums.query();

  myAlbums.albums.$promise.then(function(res){
    myAlbums.albums = res
  })

  myAlbums.getPhotos = function(id){
    var albums = myAlbums.albums;
    /* Filter Albums by id */
    var albums = albums.filter(obj => obj.id === id)
    /* Handle If user Click on Empty Albumes */
    if(typeof albums[0].photos === 'undefined' ){
      myAlbums.singleAlbum = []
    }else{
      myAlbums.singleAlbum = albums[0].photos.data
      /* Add a proprtyr selected to Hanlde the pictures selected */
      myAlbums.singleAlbum.map((album) => album.selected = false)
    }
  }

  myAlbums.selected = function() {
    var count = 0;
    angular.forEach(myAlbums.singleAlbum, function(photo) {
      count += photo.selected ? 1 : 0;
    });
    return count;
  };
})
.directive('toggleClass', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function(){
              // console.log("Still Working");
              var col1 = angular.element( document.getElementsByClassName( '--col-1' ) );
              var col2 = angular.element( document.getElementsByClassName( '--col-2' ) );
              var thumbnailOne = angular.element( document.getElementsByClassName( 'thumbnail-One' ) );
              var imgAlbum = angular.element( document.getElementsByClassName( 'imgAlbum' ) );
              var hax = angular.element( document.getElementsByClassName( 'hax' ) );
              col1.addClass("--col-1--selected")
              col2.addClass("--col-2--selected")
              thumbnailOne.addClass('thumbnail-One--selected')
              imgAlbum.addClass('imgAlbum--selected')
              hax.addClass('hax--selected')
            })
        }
    };
})
.factory('apiAlbums', function($resource) {
  return  $resource('http://localhost:3000/api/albums');
});

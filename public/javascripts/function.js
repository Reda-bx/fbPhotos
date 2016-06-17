angular.module('albumsApp', [])
.controller('myAlbumsController', function($scope, $http,apiAlbums){
  var myAlbums = this
  var rand = null;
  myAlbums.singleAlbum = []
  myAlbums.albums = [];
  myAlbums.cuurentAlbm = '';

  apiAlbums.getJSONAlbum().then(function(res){
    myAlbums.albums = res.data
  })

  myAlbums.getPhotos = function(id){
    var albums = myAlbums.albums;
    /* Filter Albums by id */
    var albums = albums.filter(obj => obj.id === id)
    /* Handle If user Click on Empty Albumes */
    if(typeof albums[0].photos === 'undefined' ){
      myAlbums.singleAlbum = []
    }else{
      // TODO: ADD the current album before extrating data.
      myAlbums.cuurentAlbm = albums[0].name
      myAlbums.singleAlbum = albums[0].photos.data
      /* Add a proprtyr selected to Hanlde the pictures selected */
      myAlbums.singleAlbum.map((album) => album.selected = false)
    }
  }

  myAlbums.selected = function() {
    var count = 0
    angular.forEach(myAlbums.singleAlbum, photo => count += photo.selected ? 1 : 0)
    return count
  }



  myAlbums.sendData = function(){
    var elements = document.querySelectorAll('.selected-true')
    var pictureSelected = []
    var albumSelected = []
    Array.prototype.forEach.call(elements, function(el, i){
      // Push the seleced pics to pictureSelected array
      pictureSelected.push(el.getElementsByTagName('img')[0].src);
      console.log(myAlbums.singleAlbum);
    });
    // push pictureSelected to albums
    albumSelected.push({albumName: myAlbums.cuurentAlbm, photos: pictureSelected})
    apiAlbums.postPhotos(albumSelected)
  }
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
.factory('apiAlbums', function($http) {
  return {
    getJSONAlbum: function(){
      return $http.get('http://localhost:3000/api/albums').error( error => console.error(error))
    },
    postPhotos: function(data){
      return $http({
        url: '/upload',
        method: 'POST',
        data: data,
        headers: {'Content-Type': 'application/json'}
      }).error( error => console.error(error))
    }
  }
});

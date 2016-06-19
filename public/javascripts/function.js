var socket = io.connect();

angular.module('albumsApp', [])
.controller('myAlbumsController', function($scope, $http,apiAlbums){
  var myAlbums = this
  var rand = null;
  myAlbums.singleAlbum = []
  myAlbums.albums = [];
  myAlbums.cuurentAlbm = ''
  myAlbums.bool = true
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
    document.getElementById('title-upload').innerHTML = 'Uploading in Progress, please wait.'
    var elements = document.querySelectorAll('.selected-true')
    var pictureSelected = []
    var albumSelected = []
    var userId = document.getElementById('name').getAttribute("class")
    console.log(userId);
    Array.prototype.forEach.call(elements, function(el, i){
      // Push the seleced pics to pictureSelected array
      pictureSelected.push(el.getElementsByTagName('img')[0].src);
    });
    // push pictureSelected to albums
    albumSelected.push({userId: userId, albumName: myAlbums.cuurentAlbm, photos: pictureSelected})
    // apiAlbums.postPhotos(albumSelected)
    socket.emit('uploadFiles', albumSelected)
    angular.forEach(myAlbums.singleAlbum, photo => photo.selected = false)

    // Keep the user updated about the uploading State
    //
    socket.on('uploadingState', function(data){
      // $scope.$apply lets angular know that myAlbums.bool has updated and refresh it in the DOM
      $scope.$apply(function(){
        if(data === "done"){
          myAlbums.bool = false
          console.log(myAlbums.bool);
          document.getElementById('slash').innerHTML = ''
          document.getElementById('res').innerHTML = ''
          document.getElementById('title-upload').innerHTML = 'We save all your selected in our server.'

        }else{
          // document.getElementById('upload-inprogress').style.display = "block"
          // document.getElementById('doneupload').style.display = "none"
          myAlbums.bool = true
          console.log(myAlbums.bool);
          document.getElementById('slash').innerHTML = '/ '+ pictureSelected.length
          document.getElementById('res').innerHTML = pictureSelected.length - data + 1
        }
      })
    })
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
    }
  }
});

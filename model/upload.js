// This model is responsable to make
// request to image selected by user
// and save to server

var fs = require('fs');
var request = require('request');
var path = require('path');

/* Methods */

// the download method make an request to image src and download/save it in the server
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

// the creatPath Method check/create path for each user and each albums folder (e.g: /user1/albumName/pic1,pic2,pic3,....)
var creatPath = function (path) {
  // Try to create directory
  try {
    fs.mkdirSync(path);
  } catch(e) {
    // EEXIST means that the directory exists
    if ( e.code != 'EEXIST' ) throw e;
  }
}

// the recursive method make multiply request to image src and send the respone to client (progress state)
var recursive = function (index, data, io){
  if(index==0){
    console.log("mi done");
    io.sockets.in('sessionId').emit('uploadingState', 'done')
  }else{
    // TODO: Save photos by they default names
    download(data[0].photos[index-1], './albums/'+data[0].userId+'/'+data[0].albumName+'/'+data[0].photos[index-1].split('.jpg')[0].split('/').pop()+'.jpg', function(){ //
      console.log('done');

      io.sockets.in('sessionId').emit('uploadingState', index)
      recursive(index-1, data, io)
    })
  }
}
// /* Methods END */ './'+dir+'/'+userFolder+'/'+albumName+'/test'+i+'.jpg'
module.exports = function(io) {
  connections = []
  io.sockets.on('connection', function(socket){
    connections.push(socket)
    console.log('Connected: %s sockets connected', connections.length)
    socket.join('sessionId')

    socket.on('disconnect', function(data){
      connections.splice(connections.indexOf(socket), 1);
      console.log('Disconnect: %s sockets connected', connections.length);
    });

    socket.on('uploadFiles', function(data, callback){
      console.log(data[0].photos.length);
      var imgs = data[0].photos.length
      creatPath( path.join( './albums' ))
      creatPath( path.join( './albums', data[0].userId) )
      creatPath( path.join( './albums', data[0].userId, data[0].albumName) )
      recursive(imgs, data, io)

    })
  })
}

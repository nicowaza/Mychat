var express = require('express');
var socket = require('socket.io');

var app = express();
var port = 4500;
var server = app.listen(port, function(){
  console.log(`listening to ${port}`)
})


//static files
app.use(express.static('public'));

// Socket Setup
var io = socket(server);

const user = [{name: 'Nico', id: 0}, {name:'Sibylle', id:1}];

io.on('connection', function(socket){
  console.log('socket connected', socket.id);
  const currentUser = user[Math.floor(Math.random()*user.length)];
  socket.emit('chooseUser', currentUser)

  socket.on('msg', function(data){
    console.log(data);
    io.sockets.emit('msg', data);
  });
  socket.on('typing', function(typingUser){
    socket.broadcast.emit('typing', typingUser)
  })
});
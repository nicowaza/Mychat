// Make connection
var socket = io.connect('http://localhost:4500');
let currentUser
// Query DOM
var message = document.getElementById('message'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback'),
      user = document.getElementById('user');
// Emit events
btn.addEventListener('click', function(){
  socket.emit('chat', {
      message: message.value,
      id: currentUser.id,
  });
  message.value = "";
});
message.addEventListener('keypress', function(){
  console.log('currentUser', currentUser.name);
  socket.emit('typing', currentUser.name);
});

// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = ''
    output.innerHTML += `<div class="message"><p class="${currentUser.id === data.id ? 'blue text' : 'grey text' }"> ${data.message} </p></div>`;
});
socket.on('typing', function(data){
  feedback.innerHTML = '<p><em>' + data + ' is typing...</em></p>'
})

socket.on('chooseUser',function(data){
  user.innerHTML = `<p> Hello ${data.name}, speak to ${data.name === 'Nico' ? 'Sibylle' : 'Nico'}!</p>`
  return currentUser = data;
  console.log(data)
})


































































































































































































































































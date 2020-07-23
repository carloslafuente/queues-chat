var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('room')) {
  window.location = 'index.html';
  throw new Error('The name and room properties are mandatory');
}

var user = {
  name: params.get('name'),
  room: params.get('room'),
};

socket.on('connect', function () {
  console.log('Conectado al socket');

  socket.emit('getinChat', user, function (resp) {
    // console.log(resp);
    renderTitleRoom();
    renderUsers(resp);
  });
});

// socket.emit(
//   'message',
//   {
//     message: `Hola mundo`,
//   },
//   function (resp) {
//     console.log(resp);
//   }
// );

socket.on('message', function (data) {
  // console.log(data);
  renderMessages(data, false);
  scrollBottom();
});

socket.on('personsList', function (data) {
  // console.log(data);
  renderUsers(data);
});

socket.on('privateMessage', function (message) {
  console.log(message);
});

socket.on('disconnect', function () {
  console.log('Desconectado del socket');
});

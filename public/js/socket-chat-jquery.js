var params = new URLSearchParams(window.location.search);

var name = params.get('name');
var room = params.get('room');

var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');
var titleRoom = $('#titleRoom');

function renderTitleRoom() {
  var html = '';
  html += `<span> ${room}</span>`;
  titleRoom.html(html);
}

function renderUsers(persons) {
  console.log(persons);
  var html = '';
  html += `<li>
    <a href="javascript:void(0)" class="active">
      Chat: <span> ${params.get('room')}</span></a
    >
  </li>`;
  for (var i = 0; i < persons.length; i++) {
    html += `<li>
    <a data-id='${persons[i].id}' href='javascript:void(0)'>
      <img src='assets/images/users/1.jpg' alt='user-img' class='img-circle' />
      <span>
        ${persons[i].name}
        <small class='text-success'>online</small>
      </span>
    </a>
  </li>`;
  }
  divUsuarios.html(html);
}

divUsuarios.on('click', 'a', function () {
  var id = $(this).data('id');
  if (id) {
    console.log(id);
  }
});

formEnviar.on('submit', function (event) {
  event.preventDefault();
  if (txtMensaje.val().trim().length === 0) {
    return;
  }
  socket.emit(
    'message',
    {
      message: txtMensaje.val(),
    },
    function (resp) {
      txtMensaje.val('').focus();
      renderMessages(resp, true);
      scrollBottom();
    }
  );
});

function renderMessages(message, me) {
  var html = '';
  var fecha = new Date(message.date);
  var hora = fecha.getHours() + ':' + fecha.getMinutes();

  var adminClass = 'info';
  var image = '';
  if (message.name === 'Admin') {
    adminClass = 'danger';
    image = 'hidden';
  }

  if (me) {
    html += `<li class="reverse">
      <div class="chat-content">
        <h5>${message.name}</h5>
        <div class="box bg-light-inverse">
          ${message.message}
        </div>
      </div>
      <div class="chat-img">
        <img src="assets/images/users/5.jpg" alt="user" />
      </div>
      <div class="chat-time">${hora}</div>
    </li>`;
  } else {
    html += `<li class="animated fadeIn">
    <div class="chat-img" ${image}>
      <img src="assets/images/users/1.jpg" alt="user" />
    </div>
    <div class="chat-content">
      <h5>${message.name}</h5>
      <div class="box bg-light-${adminClass}">
        ${message.message}
      </div>
    </div>
    <div class="chat-time">${hora}</div>
  </li>`;
  }

  divChatbox.append(html);
}

function scrollBottom() {
  // selectors
  var newMessage = divChatbox.children('li:last-child');

  // heights
  var clientHeight = divChatbox.prop('clientHeight');
  var scrollTop = divChatbox.prop('scrollTop');
  var scrollHeight = divChatbox.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight() || 0;

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    divChatbox.scrollTop(scrollHeight);
  }
}

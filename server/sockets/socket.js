const { io } = require('../server');
const User = require('../classes/users');
const utils = require('../utils/utils');
const { createMessage } = require('../utils/utils');

const users = new User();

io.on('connection', (client) => {
  client.on('getinChat', (data, callback) => {
    if (!data.name || !data.room) {
      return callback({
        error: true,
        message: 'The name property is mandatory',
      });
    }
    client.join(data.room);
    let persons = users.addPerson(client.id, data.name, data.room);
    callback(persons);
    client.broadcast.emit('personsList', users.getPersons());
    console.log(data);
  });

  client.on('message', (data) => {
    let person = users.getPerson(client.id);
    let message = utils.createMessage(person.name, data.message);
    client.broadcast.emit('message', message);
  });

  client.on('privateMessage', (data) => {
    let person = users.getPerson(client.id);
    client.broadcast
      .to(data.to)
      .emit('privateMessage', createMessage(person.name, data.message));
  });

  client.on('disconnect', () => {
    let deletedPerson = users.deletePerson(client.id);
    let message = utils.createMessage(
      'Admin',
      `${deletedPerson.name} leaves the chat`
    );
    client.broadcast.emit('message', message);
    client.broadcast.emit('personsList', users.getPersons());
  });
});

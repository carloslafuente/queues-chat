class Users {
  constructor() {
    this.persons = [];
  }
  
  addPerson(id, name, room) {
    let person = { id, name, room };
    this.persons.push(person);
    return this.persons;
  }

  getPerson(id) {
    let person = this.persons.filter((person) => {
      return (person.id === id);
    })[0];
    return person;
  }

  getPersons() {
    return this.persons;
  }

  getPersonsRoom(roomId) {}

  deletePerson(id) {
    console.log('Personas',this.persons)
    // Keep the deleted person reference
    let person = this.getPerson(id);
    this.persons = this.persons.filter((person) => {
      return person.id != id;
    });
    return person;
  }
}

module.exports = Users;

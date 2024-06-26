const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');

class UserService {
  constructor() {
    this.filePath = path.join(__dirname, '../data/users.json');
    this.users = this.loadUsers();
  }

  loadUsers() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf8');
        const users = JSON.parse(data);
        return users.map(user => new User(user.id, user.username));
      }
    } catch (err) {
      console.error('Error reading users from file:', err);
    }
    // Return an example user if file doesn't exist
    return [new User(1, 'Boris')];
  }

  saveUsers() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.users, null, 2));
    } catch (err) {
      console.error('Error writing users to file:', err);
    }
  }

  getUserById(id) {
    return this.users.find(user => user.id === id);
  }

  addUser(username) {
    const maxId = this.users.reduce((max, user) => (user.id > max ? user.id : max), 0);
    const newId = maxId + 1;
    const newUser = new User(newId, username);
    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }
}

module.exports = new UserService();

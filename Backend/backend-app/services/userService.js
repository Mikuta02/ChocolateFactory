const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');
const { user } = require('./cartService');
const FactoryService = require('./factoryService');
const CustomerTypeService = require('./customerTypeService');

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
        return users.map(user => new User(user.id, user.username, user.password, user.name, user.lastName, user.gender, 
          user.birthDate, user.role, user.cartId, user.accumulatedPoints, user.customerTypeId, user.isBanned, user.cancelationNumber, user.worksAtFactoryId));
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

  findUserByUsername(username){
    return this.users.find(user => user.username === username);
  }

  delete(id) {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    const userDeleted = this.users.length < initialLength;
    if (userDeleted) {
        this.saveUsers();
    }
    return userDeleted;
  }

  registerUser( username, 
    password, 
    name, 
    lastName, 
    gender, 
    birthDate) {
    const maxId = this.users.reduce((max, user) => (user.id > max ? user.id : max), 0);
    const newId = maxId + 1;
    const newUser = new User(newId, username, password, name, lastName, gender, birthDate);
    console.log("register user");
    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  registerWorker( username, 
    password, 
    name, 
    lastName, 
    gender, 
    birthDate,
    worksAtFactoryId) {
    const maxId = this.users.reduce((max, user) => (user.id > max ? user.id : max), 0);
    const newId = maxId + 1;
    const newUser = new User(newId, username, password, name, lastName, gender, birthDate);
    newUser.worksAtFactoryId = worksAtFactoryId;
    newUser.role = "Worker";
    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  updateUserPoints(userId, points) {
    const user = this.getUserById(userId);
    if (user) {
      user.accumulatedPoints += points;


      if(user.accumulatedPoints>=5000 && user.accumulatedPoints < 10000){
        user.customerTypeId = 2;
      }else if (user.accumulatedPoints >= 10000){
        user.customerTypeId = 3;
      }else{
        user.customerTypeId = 1;
      }

      this.saveUsers();
      console.log(`Updated points for user ${user.username}. New total: ${user.accumulatedPoints}`);
      return user;
    }
    throw new Error('User not found');
  }

  deductPoints(userId, points) {
    const user = this.getUserById(userId);
    if (user) {
        user.accumulatedPoints = Math.max(0, user.accumulatedPoints - points);

        if(user.accumulatedPoints>=5000 && user.accumulatedPoints < 10000){
          user.customerTypeId = 2;
        }else if (user.accumulatedPoints >= 10000){
          user.customerTypeId = 3;
        }else{
          user.customerTypeId = 1;
        }

        this.saveUsers();
        console.log(`Deducted points for user ${user.username}. New total: ${user.accumulatedPoints}`);
    }
  }

  registerUserWithRole( username, 
    password, 
    name, 
    lastName, 
    gender, 
    birthDate,
    role) {
    const maxId = this.users.reduce((max, user) => (user.id > max ? user.id : max), 0);
    const newId = maxId + 1;
    const newUser = new User(newId, username, password, name, lastName, gender, birthDate);
    newUser.role = role;
    console.log("register user with role");
    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  getAllUsers(){
    return this.users;
  }

  updateUser(id, updatedUser) {
    const user = this.users.find(u => u.id === id);
    if (user) {
        Object.assign(user, updatedUser);
        this.saveUsers();
        return user;
    }
    return null;
  }

  banUser(username, updatedUser) {
    const user = this.users.find(u => u.username === username);
    if (user) {
        Object.assign(user, updatedUser);
        this.saveUsers();
        return user;
    }
    return null;
  }

  searchUsers({ name, lastName, username}) {
    console.log('Search parameters in service:', { name, lastName, username });

    return this.users.filter(user => {
        let matches = true;

        if (name) {
            matches = matches && user.name.toLowerCase().includes(name.toLowerCase());
        }
        console.log(`Matching user ${user.name} with name ${name}: ${matches}`);

        if (lastName) {
            matches = matches && user.lastName.toLowerCase().includes(lastName.toLowerCase());
        }
        console.log(`Matching User ${user.lastName} with lastName ${lastName}: ${matches}`);

        if (username) {
            matches = matches && user.username.toLowerCase().includes(username.toLowerCase());
        }
        console.log(`Matching user ${user.username} with location ${username}: ${matches}`);
        return matches;
    });
  }

  sortUsers(users, sortBy, order) {
    console.log('Sorting parameters:', { sortBy, order }); // Log za sortiranje

    const sorted = users.sort((a, b) => {
        let result = 0;

        if (sortBy === 'name') {
            result = a.name.localeCompare(b.name);
        } else if (sortBy === 'lastName') {
            result = a.lastName.localeCompare(b.lastName);
        } else if (sortBy === 'username') {
            result = a.username.localeCompare(b.username);
        } else if (sortBy === 'accumulatedPoints'){
            result = a.accumulatedPoints - b.accumulatedPoints;
        }

        return order === 'desc' ? -result : result;
    });

    console.log('Sorted results:', sorted); // Log za sortirane rezultate
    return sorted;
  }

  filterUsers(users, filters) {
    console.log('Filtering users with filters:', filters);

    return users.filter(user => {
        let matches = true;

        if (filters.role) {
            matches = matches && user.role === filters.role;
            console.log(`Matching user ${user.name} with role ${filters.role}: ${matches}`);
        }

        if (filters.customerType) {
          const name = filters.customerType.toLowerCase();
          const type = CustomerTypeService.getTypeByName(name);
          matches = matches && type && user.customerTypeId === type.id;
        }

        if (filters.cancelationNumber) {
            matches = matches && user.cancelationNumber > 5;
            console.log(`Matching user ${user.name} with cancelationNumber greater than 5: ${matches}`);
        } else {
            console.log(`Ignoring cancelationNumber filter for user ${user.name}`);
        }

        return matches;
    });
  }

  getAllFreeManagers(){
    const factories = FactoryService.getAllFactories();
    const managers = this.users.filter(user => user.role === "Manager");
    
    const managerIds = factories.map(factory => factory.managerId);
    const freeManagers = managers.filter(manager => !managerIds.includes(manager.id));
    
    return freeManagers;
  }

  getManagerByFactoryId(factoryId){
    const factories = FactoryService.getAll();
    const factory = factories.find(factory => factory.id === factoryId);
    const manager = this.users.find(user => user.id === factory.managerId);
    return manager;
  }


  getWorkersByFactoryId(factoryId){
    const factories = FactoryService.getAll();
    const factory = factories.find(factory => factory.id === factoryId);
    const worker = this.users.filter(user => user.worksAtFactoryId === factory.id);
    return worker;
  }


  updateUserCancellationNumber(id, cancellationsInLastMonth){
    const cancelationNumber = cancellationsInLastMonth;
    const user = this.users.find(u => u.id === id);

    
    const updatedUser = {
      id: Number(id),
      cancelationNumber
    };
    
    if (user) {
        Object.assign(user, updatedUser);
        this.saveUsers();
        return user;
    }
    return null;
  }
}

module.exports = new UserService();

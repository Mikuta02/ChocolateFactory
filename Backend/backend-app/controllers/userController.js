const userService = require('../services/userService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res) => {
    const { username, password, name, lastName, gender, birthDate } = req.body;


    try {
        const existingUser = await userService.findUserByUsername(username);
        if (existingUser) {
            return res.status(422).json({ error: 'Username already exists' });
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            } else {
                try {
                    const newUser = await userService.registerUser(
                        username,
                        hash,
                        name,
                        lastName,
                        gender,
                        birthDate
                    );
                    res.status(201).json(newUser);
                } catch (error) {
                    console.error('Error adding user:', error);
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        });
    } catch (error) {
        console.error('Error checking username uniqueness:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.signUpWorker = async (req, res) => {
    const { username, password, name, lastName, gender, birthDate, worksAtFactoryId } = req.body;
    console.log(username, password, name, lastName, gender, birthDate, worksAtFactoryId);


    try {
        const existingUser = await userService.findUserByUsername(username);
        if (existingUser) {
            return res.status(422).json({ error: 'Username already exists' });
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            } else {
                try {
                    const newUser = await userService.registerWorker(
                        username,
                        hash,
                        name,
                        lastName,
                        gender,
                        birthDate,
                        Number(worksAtFactoryId)
                    );
                    res.status(201).json(newUser);
                } catch (error) {
                    console.error('Error adding user:', error);
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        });
    } catch (error) {
        console.error('Error checking username uniqueness:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.signUpWithRole = async (req, res) => {
    const { username, password, name, lastName, gender, birthDate } = req.body;
    const { role } = req.params;

    try {
        const existingUser = await userService.findUserByUsername(username);
        if (existingUser) {
            return res.status(422).json({ error: 'Username already exists' });
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            } else {
                try {
                    const newUser = await userService.registerUserWithRole(
                        username,
                        hash,
                        name,
                        lastName,
                        gender,
                        birthDate,
                        role
                    );
                    res.status(201).json(newUser);
                } catch (error) {
                    console.error('Error adding user:', error);
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        });
    } catch (error) {
        console.error('Error checking username uniqueness:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
  
    try {
      const user = await userService.findUserByUsername(username);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (user.isBanned) {
        return res.status(403).json({ error: 'User is banned' });
      }
  
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Auth failed' });
        }
        if (result) {
          const token = jwt.sign(
            {
              role: user.role,
              username: user.username,
              userId: user.id,
              isBanned: user.isBanned
            },
            "secret",
            {
              expiresIn: "1h"
            }
          );
          res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 60 * 1000 });
          return res.status(200).json({ message: 'Login successful', token: token });
        } else {
          return res.status(401).json({ error: 'Incorrect password' });
        }
      });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  



exports.delete = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const deleted = userService.delete(Number(id));
        if (deleted) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting User:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { username, name, lastName, gender, birthDate} = req.body;

    const updatedUser = {
        id: Number(id),
        username,
        name,
        lastName,
        gender,
        birthDate
    };

    try {
        const result = userService.updateUser(Number(id), updatedUser);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getUserById = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const user = userService.getUserById(Number(id));
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error finding User:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllUsers = (req, res) => {
    const users = userService.getAllUsers();
    res.json(users);
};



exports.searchUsers = (req, res) => {
    const { name, lastName, username, accumulatedPoints, sortBy, order, filterByCancellation, role, customerType } = req.query;

    try {
        //console.log('Search parameters:', { name, lastName, username, accumulatedPoints, sortBy, order, cancelationNumber, role, customerType });

        let users = userService.searchUsers({ name, lastName, username });
        //console.log('Filtered Users:', users);

        if (sortBy) {
            users = userService.sortUsers(users, sortBy, order || 'asc');
            //console.log('Sorted users:', users);
        }

        if (filterByCancellation || role || customerType) {
            users = userService.filterUsers(users, { role, customerType, filterByCancellation });
            console.log("DE DA VIDIM", filterByCancellation, role);
            //console.log('Filtered users (after additional filters):', users);
        }

        res.json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).send(error.message);
    }
};

exports.banUser = (req, res) => {
    const { username } = req.params;

    const isBanned = true;

    const updatedUser = {
        username,
        isBanned
    };

    try {
        const result = userService.banUser(username, updatedUser);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error banning user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


exports.getFreeManagers = (req, res) => {
    const users = userService.getAllFreeManagers();
    res.json(users);
};

exports.getManagerByFactoryId = (req, res) => {
    const { factoryId } = req.params;
    const manager = userService.getManagerByFactoryId(Number(factoryId));
    res.json(manager);
};


exports.getWorkersByFactoryId = (req, res) => {
    const { factoryId } = req.params;
    const worker = userService.getWorkersByFactoryId(Number(factoryId));
    res.json(worker);
};
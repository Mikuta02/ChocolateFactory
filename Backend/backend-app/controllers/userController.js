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

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const user = await userService.findUserByUsername(username); 
        if (!user) {
            return res.status(404).json({ error: 'User not found', userUsername: user.username });
        }

        if (!user.password) {
            return res.status(404).json({ error: 'Auth failed >(', userUsername: user.username });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Auth failed' });
            }
            if (result) {
                const token = jwt.sign({
                    role: user.role,
                    username: user.username,
                    userId: user.id
                }, 
                "secret", {
                    expiresIn: "1h"
                });
                res.cookie('jwt', token, {httpOnly: true, maxAge: 3 * 60 * 1000});
                return res.status(200).json({ message: 'Login successful', token: token });
            } else {
                return res.status(401).json({ error: 'Incorrect password' });
            }
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


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
}
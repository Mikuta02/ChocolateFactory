const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.delete('/users/:id', userController.delete);

module.exports = router;
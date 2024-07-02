const express = require('express');
const router = express.Router();
const customerTypeController = require('../controllers/customerTypeController');

router.get('/types', customerTypeController.getTypes);

module.exports = router;
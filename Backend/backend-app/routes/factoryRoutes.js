const express = require('express');
const router = express.Router();
const factoryController = require('../controllers/factoryController');

router.get('/factories',factoryController.getAllFactories);
router.post('/factories',factoryController.addFactory);
router.delete('/factories/:id',factoryController.deleteFactoryById);

module.exports = router;
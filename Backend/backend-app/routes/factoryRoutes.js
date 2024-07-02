const express = require('express');
const router = express.Router();
const factoryController = require('../controllers/factoryController');
const checkAuth = require('../middleware/check-auth');

router.get('/factories', factoryController.getAllFactories);
router.get('/factories/:id', factoryController.getFactoryById);
router.post('/factories', factoryController.addFactory);
router.delete('/factories/:id', factoryController.deleteFactoryById);
router.get('/search/factories', factoryController.searchFactories); 
router.get('/factories/manager/:id', factoryController.getFactoryByManagerId);

module.exports = router;

const express = require('express');
const purchaseController = require('../controllers/purchaseController');

const router = express.Router();

router.post('/purchases', purchaseController.createPurchase);

module.exports = router;

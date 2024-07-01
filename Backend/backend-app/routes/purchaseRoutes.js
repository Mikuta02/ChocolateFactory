const express = require('express');
const purchaseController = require('../controllers/purchaseController');
const router = express.Router();

router.post('/purchases', purchaseController.createPurchase);
router.get('/purchases/user/:userId', purchaseController.getUserPurchases);

module.exports = router;

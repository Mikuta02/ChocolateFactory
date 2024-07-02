const express = require('express');
const purchaseController = require('../controllers/purchaseController');
const router = express.Router();
const authenticate = require('../middleware/check-auth');

router.post('/purchases', purchaseController.createPurchase);
router.get('/purchases/user/:userId', purchaseController.getUserPurchases);
router.post('/purchases/cancel', purchaseController.cancelPurchase);
router.get('/purchases/manager', authenticate, purchaseController.getPurchasesByFactory);
router.post('/purchases/update-status', authenticate, purchaseController.updatePurchaseStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/cart/:userId', cartController.getCart);
router.post('/cart/add', cartController.addChocolate);
router.post('/cart/remove', cartController.removeChocolate);
router.post('/cart/clear/:userId', cartController.clearCart);
router.post('/cart/update-quantity', cartController.updateChocolateQuantity);

module.exports = router;

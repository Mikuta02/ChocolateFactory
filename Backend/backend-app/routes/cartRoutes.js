const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/cart', cartController.getCart);
router.post('/cart/add', cartController.addChocolate);
router.post('/cart/remove', cartController.removeChocolate);
router.post('/cart/clear', cartController.clearCart);

module.exports = router;

const purchaseService = require('../services/purchaseService');
const cartService = require('../services/cartService');
const userService = require('../services/userService');
const jwt = require('jsonwebtoken'); 


exports.createPurchase = (req, res) => {
    try {
        const { userId } = req.body;
        const cart = cartService.getCartByUserId(Number(userId));
        const user = userService.getUserById(Number(userId));
        
        if (!cart || !user) {
            return res.status(404).send('Cart or user not found');
        }

        const purchase = purchaseService.createPurchaseFromCart(cart, user);
        console.log(`Purchase created: ${JSON.stringify(purchase)}`);
        
        userService.updateUserPoints(userId, purchase.totalPrice);
        console.log(`User points updated for userId ${userId} with totalPrice ${purchase.totalPrice}`);
        
        res.status(201).json(purchase);
    } catch (error) {
        console.error('Error creating purchase:', error.message);
        res.status(500).send(error.message);
    }
};

exports.getUserPurchases = (req, res) => {
    try {
        const { userId } = req.params;
        const purchases = purchaseService.getPurchasesByUserId(Number(userId));
        res.status(200).json(purchases);
    } catch (error) {
        console.error('Error getting user purchases:', error.message);
        res.status(500).send(error.message);
    }
};

exports.cancelPurchase = (req, res) => {
    try {
        const { purchaseId, userId } = req.body;
        const canceledPurchase = purchaseService.cancelPurchase(purchaseId, userId);
        res.status(200).json(canceledPurchase);
    } catch (error) {
        console.error('Error canceling purchase:', error.message);
        res.status(500).send(error.message);
    }
};
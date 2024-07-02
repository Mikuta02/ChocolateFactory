const purchaseService = require('../services/purchaseService');
const cartService = require('../services/cartService');
const userService = require('../services/userService');
const factoryService = require('../services/factoryService');
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

exports.getPurchasesByFactory = (req, res) => {
    try {
        const managerId = req.userData.userId; // Preuzimanje userId iz tokena
        const factories = factoryService.getAllFactories().filter(factory => factory.managerId === managerId);
        
        if (!factories.length) {
            return res.status(404).json({ message: 'No factories found for this manager' });
        }

        const factoryIds = factories.map(factory => factory.id);
        const purchases = purchaseService.getPurchasesByFactoryIds(factoryIds);

        res.json(purchases);
    } catch (error) {
        console.error('Error getting purchases by factory:', error);
        res.status(500).send(error.message);
    }
};

exports.updatePurchaseStatus = (req, res) => {
    try {
        const { purchaseId, status, reason } = req.body;
        const managerId = req.userData.userId; // Assume we're using JWT and middleware for authentication

        const purchase = purchaseService.getPurchaseById(purchaseId);
        
        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }

        // Check if the managerId matches any of the factories in the purchase
        const isAuthorized = purchase.chocolates.some(item => {
            const factory = factoryService.getFactoryById(item.chocolate.factoryId);
            return factory.managerId === managerId;
        });

        if (!isAuthorized) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        purchaseService.updatePurchaseStatus(purchaseId, status, reason);
        res.status(200).json({ message: 'Purchase status updated successfully' });
    } catch (error) {
        console.error('Error updating purchase status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
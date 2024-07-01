const purchaseService = require('../services/purchaseService');
const cartService = require('../services/cartService');
const userService = require('../services/userService');

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

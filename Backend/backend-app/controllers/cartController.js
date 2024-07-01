const cartService = require('../services/cartService');
const chocolateService = require('../services/chocolateService');
const userService = require('../services/userService');

exports.getCart = (req, res) => {
    try {
        const { userId } = req.params;
        const cart = cartService.getCartByUserId(Number(userId));
        if (!cart) {
            return res.status(404).send('Cart not found');
        }
        res.json(cart);
    } catch (error) {
        console.error('Error in getCart:', error.message);
        res.status(500).send(error.message);
    }
};

exports.addChocolate = (req, res) => {
    try {
        const { userId, chocolateId, quantity, username } = req.body;
        console.log('Request to add chocolate:', userId, chocolateId, quantity, username);

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const chocolate = chocolateService.getChocolateById(chocolateId);
        if (!chocolate) {
            return res.status(404).send('Chocolate not found');
        }

        if (chocolate.amount === 0) {
            return res.status(400).send('This chocolate is not available to be added to the cart.');
        }

        cartService.addChocolateToCart(Number(userId), chocolate, quantity, username);
        res.status(200).send('Chocolate successfully added to the cart.');
    } catch (error) {
        console.error('Error in addChocolate:', error.message);
        res.status(500).send(error.message);
    }
};



exports.removeChocolate = (req, res) => {
    try {
        const { userId, chocolateId } = req.body;
        cartService.removeChocolateFromCart(Number(userId), chocolateId);
        res.json(cartService.getCartByUserId(Number(userId)));
    } catch (error) {
        console.error('Error in removeChocolate:', error.message);
        res.status(500).send(error.message);
    }
};

exports.clearCart = (req, res) => {
    try {
        const { userId } = req.params;
        cartService.clearCart(Number(userId));
        res.json(cartService.getCartByUserId(Number(userId)));
    } catch (error) {
        console.error('Error in clearCart:', error.message);
        res.status(500).send(error.message);
    }
};

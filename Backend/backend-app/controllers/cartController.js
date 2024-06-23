const cartService = require('../services/cartService');
const chocolateService = require('../services/chocolateService');

exports.getCart = (req, res) => {
  try {
    const cart = cartService.getCart();
    res.json(cart);
  } catch (error) {
    console.error('Error in getCart:', error.message);
    res.status(500).send(error.message);
  }
};

exports.addChocolate = (req, res) => {
  try {
    const { chocolateId, quantity } = req.body;
    console.log('Request to add chocolate:', chocolateId, quantity);
    const chocolate = chocolateService.getChocolateById(chocolateId); // Ovaj metod sada postoji u chocolateService
    if (chocolate) {
      cartService.addChocolateToCart(chocolate, quantity);
      res.json(cartService.getCart());
    } else {
      res.status(404).send('Chocolate not found');
    }
  } catch (error) {
    console.error('Error in addChocolate:', error.message);
    res.status(500).send(error.message);
  }
};

exports.removeChocolate = (req, res) => {
  try {
    const { chocolateId } = req.body;
    console.log('Request to remove chocolate:', chocolateId);
    cartService.removeChocolateFromCart(chocolateId);
    res.json(cartService.getCart());
  } catch (error) {
    console.error('Error in removeChocolate:', error.message);
    res.status(500).send(error.message);
  }
};

exports.clearCart = (req, res) => {
  try {
    console.log('Request to clear cart');
    cartService.clearCart();
    res.json(cartService.getCart());
  } catch (error) {
    console.error('Error in clearCart:', error.message);
    res.status(500).send(error.message);
  }
};

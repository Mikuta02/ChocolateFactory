const path = require('path');
const fs = require('fs');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const Chocolate = require('../models/chocolateModel');

class CartService {
  constructor() {
    this.filePath = path.join(__dirname, '../data/cart.json');
    this.user = new User(1, 'Boris');
    this.cart = this.loadCart();
  }

  loadCart() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf8');
        const cartData = JSON.parse(data);
        console.log('Loaded cart data:', cartData);

        if (Array.isArray(cartData) && cartData.length > 0) {
          const cartItem = cartData[0];
          const user = new User(cartItem.user.id, cartItem.user.username);
          const chocolates = cartItem.chocolates.map(item => ({
            chocolate: new Chocolate(
              item.chocolate.id,
              item.chocolate.name,
              item.chocolate.price,
              item.chocolate.chocolateType,
              item.chocolate.factoryId,
              item.chocolate.chocolateVariety,
              item.chocolate.grams,
              item.chocolate.description,
              item.chocolate.picturePath,
              item.chocolate.status,
              item.chocolate.amount
            ),
            quantity: item.quantity
          }));
          return new Cart(cartItem.id, user, chocolates, cartItem.totalPrice);
        }
      }
    } catch (err) {
      console.error('Error reading cart from file:', err);
    }
    console.log('Creating new cart');
    return new Cart(1, this.user);
  }

  saveCart() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify([this.cart], null, 2));
      console.log('Saved cart data:', this.cart);
    } catch (err) {
      console.error('Error writing cart to file:', err);
    }
  }

  getCart() {
    return this.cart;
  }

  addChocolateToCart(chocolate, quantity) {
    console.log('Adding chocolate to cart:', chocolate, quantity);
    const existingChocolate = this.cart.chocolates.find(item => item.chocolate.id === chocolate.id);
    if (existingChocolate) {
      existingChocolate.quantity += quantity;
    } else {
      this.cart.chocolates.push({ chocolate, quantity });
    }
    this.updateTotalPrice();
    this.saveCart();
  }

  removeChocolateFromCart(chocolateId) {
    console.log('Removing chocolate from cart:', chocolateId);
    this.cart.chocolates = this.cart.chocolates.filter(item => item.chocolate.id !== chocolateId);
    this.updateTotalPrice();
    this.saveCart();
  }

  clearCart() {
    console.log('Clearing cart');
    this.cart.chocolates = [];
    this.cart.totalPrice = 0;
    this.saveCart();
  }

  updateTotalPrice() {
    this.cart.totalPrice = this.cart.chocolates.reduce((total, item) => total + item.chocolate.price * item.quantity, 0);
  }
}

module.exports = new CartService();

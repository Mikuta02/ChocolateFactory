const path = require('path');
const fs = require('fs');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const Chocolate = require('../models/chocolateModel');


class CartService {
    constructor() {
        this.filePath = path.join(__dirname, '../data/cart.json');
        this.carts = this.loadCarts();
    }

    deleteCart(userId) {
        this.carts = this.carts.filter(cart => cart.user.id !== userId);
        this.saveCarts();
    }
    
    loadCarts() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf8');
                const cartData = JSON.parse(data);
                return cartData.map(cartItem => {
                    const user = new User(
                        cartItem.user.id,
                        cartItem.user.username,
                        cartItem.user.password,
                        cartItem.user.name,
                        cartItem.user.lastName,
                        cartItem.user.gender,
                        cartItem.user.birthDate,
                        cartItem.user.role,
                        cartItem.user.cartId,
                        cartItem.user.accumulatedPoints,
                        cartItem.user.customerType,
                        cartItem.user.isBanned
                    );
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
                });
            }
        } catch (err) {
            console.error('Error reading cart from file:', err);
        }
        return [];
    }

    saveCarts() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2));
        } catch (err) {
            console.error('Error writing cart to file:', err);
        }
    }

    getCartByUserId(userId, customerTypeId) {
        let cart = this.carts.find(cart => cart.user.id === userId);
        if (!cart) {
            const user = new User(userId, '');
            user.customerTypeId = customerTypeId;
            cart = new Cart(this.carts.length + 1, user);
            this.carts.push(cart);
            this.saveCarts();
        }
        console.log(`Cart for user ${userId}:`, cart);
        return cart;
    }

    addChocolateToCart(userId, chocolate, quantity, username, customerTypeId) {
        let cart = this.getCartByUserId(userId, customerTypeId);
        if (!cart) {
            console.log(`No cart found for user ${userId}, creating a new one.`);
            const user = new User(userId, username, customerTypeId);
            user.customerTypeId = customerTypeId;
            cart = new Cart(this.carts.length + 1, user);
            this.carts.push(cart);
        } else if (!cart.user.username) {
            // Ako korisničko ime nije postavljenp
            cart.user.username = username;
        }
        const existingChocolate = cart.chocolates.find(item => item.chocolate.id === chocolate.id);
        if (existingChocolate) {
            existingChocolate.quantity += quantity;
        } else {
            cart.chocolates.push({ chocolate, quantity });
        }
        this.updateTotalPrice(cart, customerTypeId);
        this.saveCarts();
    }

    removeChocolateFromCart(userId, chocolateId) {
        const cart = this.getCartByUserId(userId);
        if (cart) {
            cart.chocolates = cart.chocolates.filter(item => item.chocolate.id !== chocolateId);
            this.updateTotalPrice(cart);
            this.saveCarts();
        }
    }

    clearCart(userId) {
        const cart = this.getCartByUserId(userId);
        if (cart) {
            cart.chocolates = [];
            cart.totalPrice = 0;
            this.saveCarts();
        }
    }

    updateTotalPrice(cart, customerTypeId) {
        cart.totalPrice = cart.chocolates.reduce((total, item) => total + item.chocolate.price * item.quantity, 0);
        console.log("OVO JE NJEGOV ID TIP AJAAJAJAJAJ", cart.user.customerTypeId);
        if (customerTypeId === 2) {
            cart.totalPrice *= 0.97; 
        } else if (customerTypeId === 3) {
            cart.totalPrice *= 0.95;
        }
    }

    updateChocolateQuantity(userId, chocolateId, quantity) {
        const cart = this.getCartByUserId(userId);
        const chocolateItem = cart.chocolates.find(item => item.chocolate.id === chocolateId);
        if (chocolateItem) {
            const availableQuantity = chocolateItem.chocolate.amount;
            if (quantity < 1) {
                quantity = 1;
            }
            if (quantity > availableQuantity) {
                return { success: false, message: `Quantity exceeds available stock. Maximum available: ${availableQuantity}` };
            }
            chocolateItem.quantity = quantity;
            this.updateTotalPrice(cart);
            this.saveCarts();
            return { success: true };
        }
        return { success: false, message: 'Chocolate not found in cart' };
    }

    createPurchaseFromCart(userId) {
        const cart = this.getCartByUserId(userId);
        if (!cart || cart.chocolates.length === 0) {
            throw new Error('Cart is empty or not found');
        }

        const totalPrice = cart.totalPrice;
        const purchase = {
            id: generateUniqueId(),  
            chocolates: cart.chocolates,
            factoryId: cart.chocolates[0].chocolate.factoryId, 
            date: new Date().toISOString(),
            price: totalPrice,
            customerName: `${cart.user.name} ${cart.user.lastName}`,
            customerId: cart.user.id,
            status: PurchaseStatusEnum.PROCESSING
        };

        const points = Math.floor(totalPrice / 1000 * 133);
        userService.addPoints(userId, points);

       
        purchaseService.addPurchase(purchase);

        
        this.clearCart(userId);

        return purchase;
    }
}

module.exports = new CartService();
const path = require('path');
const fs = require('fs');
const Purchase = require('../models/purchaseModel');
const Factory = require('../models/factoryModel');
const PurchaseStatusEnum = require('../models/purchaseStatusEnum');
const userService = require('./userService');
const cartService = require('./cartService');
const factoryService = require('./factoryService')

class PurchaseService {
    constructor() {
        this.filePath = path.join(__dirname, '../data/purchases.json');
        this.purchases = this.loadPurchases();
    }

    addPurchase(purchase) {
        this.purchases.push(purchase);
        this.savePurchases();
    }

    loadPurchases() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf8');
                return JSON.parse(data);
            }
        } catch (err) {
            console.error('Error reading purchases from file:', err);
        }
        return [];
    }

    savePurchases() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.purchases, null, 2));
        } catch (err) {
            console.error('Error writing purchases to file:', err);
        }
    }

    createPurchaseFromCart(cart, user) {
        const totalPrice = cart.totalPrice;
        
        const chocolatesWithFactory = cart.chocolates.map(item => {
            const factory = factoryService.getFactoryById(item.chocolate.factoryId);
            return {
                ...item,
                factoryName: factory ? factory.name : 'Unknown Factory'
            };
        });

        const purchase = {
            id: this.purchases.length + 1,
            chocolates: cart.chocolates,
            factory: chocolatesWithFactory,
            date: new Date().toISOString(),
            totalPrice: totalPrice,
            customerName: `${user.name} ${user.lastName}`,
            customerId: cart.user.id,
            status: PurchaseStatusEnum.PROCESSING
        };

        const points = Math.floor(totalPrice / 1000 * 133);
        userService.updateUserPoints(user.id, points);
        console.log(`Updated points for user ${user.username}. New total: ${user.accumulatedPoints + points}`);
        this.addPurchase(purchase);
        
        cartService.clearCart(user.id);
        cartService.deleteCart(user.id);
        return purchase;
    }

    getPurchasesByUserId(userId) {
    return this.purchases.filter(purchase => purchase.customerId === userId);
    }

    cancelPurchase(purchaseId, userId) {
        const purchase = this.purchases.find(p => p.id === purchaseId && p.customerId === userId);
        if (!purchase) {
            throw new Error('Purchase not found or does not belong to the user');
        }

        if (purchase.status === PurchaseStatusEnum.PROCESSING) {
            purchase.status = PurchaseStatusEnum.CANCELED;
            const lostPoints = Math.floor(purchase.totalPrice / 1000 * 133 * 4);
            userService.deductPoints(userId, lostPoints);
            this.savePurchases();
            return purchase;
        } else {
            throw new Error('Purchase cannot be canceled');
        }
    }
    
}

module.exports = new PurchaseService();

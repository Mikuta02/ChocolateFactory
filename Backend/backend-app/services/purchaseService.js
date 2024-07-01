const path = require('path');
const fs = require('fs');
const Purchase = require('../models/purchaseModel');
const PurchaseStatusEnum = require('../models/purchaseStatusEnum');

class PurchaseService {
    constructor() {
        this.filePath = path.join(__dirname, '../data/purchases.json');
        this.purchases = this.loadPurchases();
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
        const newPurchase = new Purchase(
            this.purchases.length + 1,
            cart.chocolates,
            cart.factory,
            new Date().toISOString(),
            cart.totalPrice,
            `${user.name} ${user.lastName}`,
            PurchaseStatusEnum.Processing
        );
        this.purchases.push(newPurchase);
        this.savePurchases();

        // Očisti korpu nakon kreiranja porudžbine
        cart.chocolates = [];
        cart.totalPrice = 0;

        return newPurchase;
    }

    
}

module.exports = new PurchaseService();

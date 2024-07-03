const path = require('path');
const fs = require('fs');
const Purchase = require('../models/purchaseModel');
const Factory = require('../models/factoryModel');
const PurchaseStatusEnum = require('../models/purchaseStatusEnum');
const userService = require('./userService');
const cartService = require('./cartService');
const factoryService = require('./factoryService');
const chocolateService = require('./chocolateService');
const CancellationService = require('./cancellationService');

class PurchaseService {
    constructor() {
        this.filePath = path.join(__dirname, '../data/purchases.json');
        this.purchases = this.loadPurchases();
        this.startCancellationCheck(); 
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

        let discount = 1
        if(user.customerTypeId === 2){
            discount = 0.97; 
        }else if(user.customerTypeId === 3){
            discount = 0.95;
        }

        const purchase = {
            id: this.purchases.length + 1,
            chocolates: cart.chocolates,
            factory: chocolatesWithFactory,
            date: new Date().toISOString(),
            totalPrice: totalPrice*discount,
            customerName: `${user.name} ${user.lastName}`,
            customerId: cart.user.id,
            status: PurchaseStatusEnum.PROCESSING
        };

        const points = Math.floor(totalPrice / 1000 * 133);
        userService.updateUserPoints(user.id, points);
        console.log(`Updated points for user ${user.username}. New total: ${user.accumulatedPoints + points}`);
        this.addPurchase(purchase);
        
        cart.chocolates.forEach(item => {
            chocolateService.reduceChocolateAmount(item.chocolate.id, item.quantity);
        });

        cartService.clearCart(user.id);
        cartService.deleteCart(user.id);
        return purchase;
    }

    getPurchasesByUserId(userId, { factoryName, minPrice, maxPrice, startDate, endDate, sortBy, sortOrder }) {
        console.log('Filtering purchases for user:', userId);
        console.log('Received filter parameters:', { factoryName, minPrice, maxPrice, startDate, endDate, sortBy, sortOrder });

        let purchases = this.purchases.filter(purchase => purchase.customerId === Number(userId));
        console.log('Initial purchases:', purchases);

        // Apply filters
        if (factoryName) {
            purchases = purchases.filter(purchase =>
                purchase.factory && purchase.factory.some(f => f.factoryName && f.factoryName.includes(factoryName))
            );
            console.log('After factoryName filter:', purchases);
        }

        if (minPrice !== undefined && maxPrice !== undefined && minPrice !== '' && maxPrice !== '') {
            purchases = purchases.filter(purchase =>
                purchase.totalPrice >= Number(minPrice) && purchase.totalPrice <= Number(maxPrice)
            );
            console.log('After price range filter:', purchases);
        }

        if (startDate && endDate) {
            purchases = purchases.filter(purchase =>
                new Date(purchase.date) >= new Date(startDate) && new Date(purchase.date) <= new Date(endDate)
            );
            console.log('After date range filter:', purchases);
        }

        // Apply sorting
        if (sortBy) {
            purchases.sort((a, b) => {
                let fieldA, fieldB;
                if (sortBy === 'factoryName') {
                    fieldA = (a.factory && a.factory[0]) ? a.factory[0].factoryName : '';
                    fieldB = (b.factory && b.factory[0]) ? b.factory[0].factoryName : '';
                } else {
                    fieldA = a[sortBy];
                    fieldB = b[sortBy];
                }

                if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
                if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
            console.log('After sorting:', purchases);
        }

        return purchases;
    }

    getPurchasesByFactoryIds(factoryIds) {
        return this.purchases.filter(purchase => 
            purchase.chocolates.some(item => factoryIds.includes(item.chocolate.factoryId))
        );
    }

    
    cancelPurchase(purchaseId, userId) {
    const purchase = this.purchases.find(p => p.id === purchaseId && p.customerId === userId);
    if (!purchase) {
        throw new Error('Purchase not found or does not belong to the user');
    }

    if (purchase.status === PurchaseStatusEnum.PROCESSING) {
        purchase.status = PurchaseStatusEnum.CANCELED;

        // Vratite količinu čokolade
        purchase.chocolates.forEach(item => {
            const chocolate = chocolateService.getChocolateById(item.chocolate.id);
            if (chocolate) {
                chocolateService.updateChocolateAmount(chocolate.id, chocolate.amount + item.quantity);
            }
        });

        const lostPoints = Math.floor(purchase.totalPrice / 1000 * 133 * 4);
        userService.deductPoints(userId, lostPoints);
        this.savePurchases();
        return purchase;
    } else {
        throw new Error('Purchase cannot be canceled');
    }
    }

    getCurrentDateFormatted() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); 
        const day = String(now.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    }
    
    updatePurchaseStatus(purchaseId, status, reason) {
        const purchase = this.purchases.find(p => p.id === purchaseId);
        if (purchase) {
            purchase.status = status;
            if (status === 'Odbijeno') {
                purchase.reason = reason;
    
                // Vratiti količinu čokolade
                purchase.chocolates.forEach(item => {
                    const chocolate = chocolateService.getChocolateById(item.chocolate.id);
                    if (chocolate) {
                        chocolateService.updateChocolateAmount(chocolate.id, chocolate.amount + item.quantity);
                    }
                });
            }
            this.savePurchases();
            return purchase;
        }
        throw new Error('Purchase not found');
    }
    
    getPurchaseById(purchaseId) {
        return this.purchases.find(p => p.id === purchaseId);
    }


    startCancellationCheck() {
        setInterval(() => {
            this.checkAndUpdateCancellations();
        }, 10 * 60 * 1000); 
    }

    checkAndUpdateCancellations() {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        console.log("Checking cancellations");
        const users = userService.getAllUsers();
        users.forEach(user => {
            const cancellationsInLastMonth = this.purchases.filter(purchase =>
                purchase.customerId === user.id &&
                (purchase.status === PurchaseStatusEnum.CANCELED || purchase.status === "otkazano") &&
                new Date(purchase.date) >= oneMonthAgo
            ).length;

            userService.updateUserCancellationNumber(user.id, cancellationsInLastMonth);
        });
    }

}

module.exports = new PurchaseService();

const PurchaseStatusEnum = require('./purchaseStatusEnum');

class Purchase {
    constructor(id, chocolates, factory, date, totalPrice, customerName, status = PurchaseStatusEnum.OBRADA) {
        this.id = id;
        this.chocolates = chocolates;
        this.factory = factory;
        this.date = date;
        this.totalPrice = totalPrice;
        this.customerName = customerName;
        this.status = status;
    }
}

module.exports = Purchase;

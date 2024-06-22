const User = require('./userModel');

class Cart{
    constructor(id,user,chocolates = [],totalPrice = 0){
        this.id = id;
        this.user = user;
        this.chocolates = chocolates;
        this.totalPrice = totalPrice;
    }
}

module.exports = Cart;
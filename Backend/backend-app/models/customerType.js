class CustomerType{
    constructor(id,name, discount, pointsNeeded){
        this.id = id;
        this.pointsNeeded = pointsNeeded;
        this.discount = discount;
        this.name = name;
    }
}

module.exports = CustomerType;
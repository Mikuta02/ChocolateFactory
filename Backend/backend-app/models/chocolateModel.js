const ChocolateType = require('./chocolateTypeEnum');
const ChocolateVariety = require('./chocolateVarietyEnum');

class Chocolate{
    constructor(id, name, price, chocolateType, factoryId=0, chocolateVariety, grams, description='N/A', picturePath='', status='unavailable', amount=0){
        this.id = id;
        this.name = name;
        this.price = price;
        this.chocolateType = chocolateType;
        this.factoryId = factoryId;
        this.chocolateVariety = chocolateVariety;
        this.grams = grams;
        this.description = description;
        this.picturePath = picturePath;
        this.status = status;
        this.amount = amount;
    }
}

module.exports = Chocolate;
const Chocolate = require('../models/chocolateModel');
const ChocolateVarietyEnum = require('../models/chocolateVarietyEnum');
const ChocolateTypeEnum = require('../models/chocolateTypeEnum');
const path = require('path');
const fs = require('fs');

class ChocolateService{
    constructor(){
        this.filePath = path.join(__dirname, '../data/chocolates.json');
        this.chocolates = this.loadChocolates();
    }

    loadChocolates(){
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf8');
                const chocolates = JSON.parse(data);
                return chocolates.map(chocolate => new Chocolate(
                    chocolate.id,
                    chocolate.name,
                    chocolate.price,
                    chocolate.chocolateType,
                    chocolate.factoryId,
                    chocolate.chocolateVariety,
                    chocolate.grams,
                    chocolate.description,
                    chocolate.picturePath,
                    chocolate.status,
                    chocolate.amount
                ));
            }
        } catch (err) {
            console.error('Error reading chocolates from file:', err);
        }
        return [
            new Chocolate(1, 'Magnum', 200, ChocolateTypeEnum.Normal, 1, ChocolateVarietyEnum.Raisins, 250, 'Milky and tasty goodness', '', 'unavailable', 0)
        ];
    }

    saveChocolates(){
        try{
            fs.writeFileSync(this.filePath, JSON.stringify(this.chocolates, null, 2));
        } catch(err){
            console.error('Error writing chocolates to file:', err);
        }
    }

    getAllChocolates(){
        return this.chocolates;
    }

    getChocolateByFactoryId(factoryId){
        var factoryChocolates = this.chocolates.filter(chocolate => chocolate.factoryId === factoryId);
        return factoryChocolates;
    }

    deleteChocolateById(id){
        const initialLength = this.chocolates.length;
        this.chocolates = this.chocolates.filter(chocolate => chocolate.id !== id);
        const chocolateDeleted = this.chocolates.length < initialLength;
        if (chocolateDeleted) {
            this.saveChocolates();
        }
        return chocolateDeleted;
    }

    addChocolate(name, price, chocolateType, factoryId, chocolateVariety, grams, description, picturePath='', status='unavailable', amount=0){
        const maxId = this.chocolates.reduce((max, chocolate) => (chocolate.id > max ? chocolate.id : max), 0);
        const newId = maxId + 1;
        const newChocolate = new Chocolate(newId, name, price, chocolateType, factoryId, chocolateVariety, grams, description, picturePath, status, amount);
        this.chocolates.push(newChocolate);
        this.saveChocolates();
        return newChocolate;
    }
}

module.exports = new ChocolateService();
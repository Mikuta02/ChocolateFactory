const CustomerType = require('../models/customerType');
const path = require('path');
const fs = require('fs');

class CustomerTypeService {
    constructor() {
        this.filePath = path.join(__dirname, '../data/customerTypes.json');
        this.customerTypes = this.loadTypes();
    }

    loadTypes() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf8');
                const customerTypes = JSON.parse(data);
                return customerTypes.map(type => new CustomerType(
                    type.id,
                    type.name,
                    type.discount,
                    type.pointsNeeded
                ));
            }
        } catch (err) {
            console.error('Error reading types from file:', err);
        }
        return [
            new CustomerType(1, 0, 0, "Test")
        ];
    }

    saveTypes() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.customerTypes, null, 2));
        } catch (err) {
            console.error('Error writing types to file:', err);
        }
    }

    getAllTypes() {
        return this.customerTypes;
    }

    getTypeById(id) {
        return this.customerTypes.find(type => type.id === id);
    }

    getTypeByName(name) {
        return this.customerTypes.find(type => type.name.toLowerCase() === name);
    }
}

module.exports = new CustomerTypeService();

const Factory = require('../models/factoryModel');
const path = require('path');
const fs = require('fs');

class FactoryService{
    constructor(){
        this.filePath = path.join(__dirname, '../data/factories.json');
        this.factories = this.loadFactories();
    }

    loadFactories(){
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf8');
                const factories = JSON.parse(data);
                return factories.map(factory => new Factory(
                    factory.id,
                    factory.name,
                    factory.workingHours,
                    factory.status,
                    factory.location,
                    factory.logoPath,
                    factory.rating
                ));
            }
        } catch (err) {
            console.error('Error reading factories from file:', err);
        }
        return [
            new Factory(1, 'Fabrika Loznica', '9am-5pm', 'otvorena', 'Loznica', 'fabrika1.jpg', 4.5),
            new Factory(2, 'Fabrika Ostoja', '10am-1pm', 'zatvorena', 'Sabac', 'fabrika2.jpg', 3.8),
            new Factory(3, 'Fabrika Smederevac', '1am-3pm', 'zatvorena', 'Sabac', 'fabrika3.jpg', 2.8),
            new Factory(4, 'Fabrika Beograd', '12am-4pm', 'otvorena', 'Beograd', 'fabrika4.jpg', 3.84),
        ];
    }

    saveFactories() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.factories, null, 2));
        } catch (err) {
            console.error('Error writing factories to file:', err);
        }
    }

    getAllFactories() {
        return this.factories.sort((a, b) => {
            if (a.status === 'otvorena' && b.status !== 'otvorena') {
                return -1;
            }
            if (a.status !== 'otvorena' && b.status === 'otvorena') {
                return 1;
            }
            return a.name.localeCompare(b.name);
        });
    }

    addFactory(name, workingHours, status, location, logoPath = '', rating = 0) {
        const maxId = this.factories.reduce((max, factory) => (factory.id > max ? factory.id : max), 0);
        const newId = maxId + 1;
        const newFactory = new Factory(newId, name, workingHours, status, location, logoPath, rating);
        this.factories.push(newFactory);
        this.saveFactories();
        return newFactory;
    }

    deleteFactoryById(id) {
        const initialLength = this.factories.length;
        this.factories = this.factories.filter(factory => factory.id !== id);
        const factoryDeleted = this.factories.length < initialLength;
        if (factoryDeleted) {
            this.saveFactories();
        }
        return factoryDeleted;
    }

    getFactoryById(id){
        return this.factories.find(factory => factory.id === id);
    }
}

module.exports = new FactoryService();
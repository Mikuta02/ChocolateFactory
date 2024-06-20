const Factory = require('../models/factoryModel');
const Location = require('../models/locationModel');
const path = require('path');
const fs = require('fs');

class FactoryService {
    constructor() {
        this.filePath = path.join(__dirname, '../data/factories.json');
        this.factories = this.loadFactories();
    }

    loadFactories() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf8');
                const factories = JSON.parse(data);
                return factories.map(factory => new Factory(
                    factory.id,
                    factory.name,
                    factory.workingHours,
                    factory.status,
                    new Location(factory.location.latitude, factory.location.longitude, factory.location.address),
                    factory.logoPath,
                    factory.rating
                ));
            }
        } catch (err) {
            console.error('Error reading factories from file:', err);
            return [];
        }
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

    validateAddress(address) {
        const regex = /^[a-zA-Z0-9\s,.'-]+, [a-zA-Z\s]+[ ,]?\d{5}$/;
        return regex.test(address);
    }

    addFactory(name, workingHours, status, latitude, longitude, address, logoPath = '', rating = 0) {
        if (!this.validateAddress(address)) {
            throw new Error('Invalid address format');
        }

        if (isNaN(latitude) || isNaN(longitude)) {
            throw new Error('Latitude and longitude must be numbers');
        }

        const maxId = this.factories.reduce((max, factory) => (factory.id > max ? factory.id : max), 0);
        const newId = maxId + 1;
        const newLocation = new Location(latitude, longitude, address);
        const newFactory = new Factory(newId, name, workingHours, status, newLocation, logoPath, rating);
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

    getFactoryById(id) {
        return this.factories.find(factory => factory.id === id);
    }
}

module.exports = new FactoryService();

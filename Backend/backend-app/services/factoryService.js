const fs = require('fs');
const path = require('path');
const Factory = require('../models/factoryModel');
const Location = require('../models/locationModel');
const ChocolateService = require('./chocolateService');

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
                console.log('Factories loaded:', factories); // Dodaj log za učitane fabrike
                return factories.map(factory => new Factory(
                    factory.id,
                    factory.name,
                    factory.workingHours,
                    factory.status,
                    new Location(factory.location.latitude, factory.location.longitude, factory.location.address),
                    factory.logoPath,
                    factory.rating,
                    factory.managerId
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

    getAll(){
        return this.factories;
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

    searchFactories({ name, chocolateName, location, rating }) {
        console.log('Search parameters in service:', { name, chocolateName, location, rating });

        return this.factories.filter(factory => {
            let matches = true;

            if (name) {
                matches = matches && factory.name.toLowerCase().includes(name.toLowerCase());
            }
            console.log(`Matching factory ${factory.name} with name ${name}: ${matches}`);

            if (chocolateName) {
                const chocolates = ChocolateService.getChocolateByFactoryId(factory.id);
                matches = matches && chocolates.some(chocolate => chocolate.name.toLowerCase().includes(chocolateName.toLowerCase()));
            }
            console.log(`Matching factory ${factory.name} with chocolateName ${chocolateName}: ${matches}`);

            if (location) {
                matches = matches && factory.location.address.toLowerCase().includes(location.toLowerCase());
            }
            console.log(`Matching factory ${factory.name} with location ${location}: ${matches}`);

            if (rating) {
                matches = matches && factory.rating >= rating;
            }
            console.log(`Matching factory ${factory.name} with rating ${rating}: ${matches}`);

            return matches;
        });
    }
    

    sortFactories(factories, sortBy, order) {
        console.log('Sorting parameters:', { sortBy, order }); // Log za sortiranje

        const sorted = factories.sort((a, b) => {
            let result = 0;

            if (sortBy === 'name') {
                result = a.name.localeCompare(b.name);
            } else if (sortBy === 'location') {
                result = a.location.address.localeCompare(b.location.address);
            } else if (sortBy === 'rating') {
                result = a.rating - b.rating;
            }

            return order === 'desc' ? -result : result;
        });

        console.log('Sorted results:', sorted); // Log za sortirane rezultate
        return sorted;
    }

    filterFactories(factories, filters) {
        console.log('Filtering factories with filters:', filters);

        return factories.filter(factory => {
            let matches = true;

            if (filters.chocolateType) {
                const chocolates = ChocolateService.getChocolateByFactoryId(factory.id);
                matches = matches && chocolates.some(chocolate => chocolate.chocolateType === filters.chocolateType);
                console.log(`Matching factory ${factory.name} with chocolateType ${filters.chocolateType}: ${matches}`);
            }

            if (filters.chocolateVariety) {
                const chocolates = ChocolateService.getChocolateByFactoryId(factory.id);
                matches = matches && chocolates.some(chocolate => chocolate.chocolateVariety === filters.chocolateVariety);
                console.log(`Matching factory ${factory.name} with chocolateVariety ${filters.chocolateVariety}: ${matches}`);
            }

            if (filters.openOnly === 'true') {
                matches = matches && (factory.status === 'otvorena' || factory.status === 'otvoreno');
                console.log(`Matching factory ${factory.name} with openOnly ${filters.openOnly}: ${matches}`);
            } else {
                console.log(`Ignoring openOnly filter for factory ${factory.name}`);
            }

            return matches;
        });
    }

    addFactory(name, workingHours, status, latitude, longitude, address, logoPath = '', rating = 0, managerId) {
        // if (!this.validateAddress(address)) {
        //     throw new Error('Invalid address format');
        // }

        if (isNaN(latitude) || isNaN(longitude)) {
            throw new Error('Latitude and longitude must be numbers');
        }

        const maxId = this.factories.reduce((max, factory) => (factory.id > max ? factory.id : max), 0);
        const newId = maxId + 1;
        const newLocation = new Location(latitude, longitude, address);
        const newFactory = new Factory(newId, name, workingHours, status, newLocation, logoPath, rating, managerId);
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

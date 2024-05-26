const Factory = require('../models/factoryModel');


class FactoryService{
    constructor(){
        this.factories = [
            new Factory(1,'Fabrika Loznica','9am-5pm','otvorena','loznica','logoLo.png',4.5),
            new Factory(2,'fabrika sabac','10am-4pm','zatvorena','sabac','logoSa.png',3.8),
        ];
    }

    getAllFactories() {
        return this.factories.sort((a, b) => b.status.localeCompare(a.status));
    }

    addFactory(name, workingHours, status, location, logoPath = '', rating = 0) {
        const maxId = this.factories.reduce((max, factory) => (factory.id > max ? factory.id : max), 0);
        const newId = maxId + 1;
        const newFactory = new Factory(newId, name, workingHours, status, location, logoPath, rating);
        this.factories.push(newFactory);
        return newFactory;
    }

    deleteFactoryById(id) {
        console.log('Initial factory list:', this.factories);
        console.log('Deleting factory with ID:', id);
        const initialLength = this.factories.length;
        this.factories = this.factories.filter(factory => factory.id !== id);
        console.log('Updated factory list:', this.factories);
        return this.factories.length < initialLength;
    }
}

module.exports = new FactoryService();
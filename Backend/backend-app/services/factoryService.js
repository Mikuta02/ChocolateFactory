const Factory = require('../models/factoryModel');


class FactoryService{
    constructor(){
        this.factories = [
            new Factory(1,'Fabrika Loznica','9am-5pm','otvorena','Loznica','fabrika1.jpg',4.5),
            new Factory(2,'Fabrika Ostoja','10am-1pm','zatvorena','Sabac','fabrika2.jpg',3.8),
            new Factory(3,'Fabrika Smederevac','1am-3pm','zatvorena','Sabac','fabrika3.jpg',2.8),
            new Factory(4,'Fabrika Beograd','12am-4pm','otvorena','Beograd','fabrika4.jpg',3.84),
        ];
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
        return newFactory;
    }

    deleteFactoryById(id) {
        const initialLength = this.factories.length;
        this.factories = this.factories.filter(factory => factory.id !== id);
        return this.factories.length < initialLength;
    }
}

module.exports = new FactoryService();
const Cancellation = require('../models/cancellationModel');
const path = require('path');
const fs = require('fs');

class CancellationService {
    constructor() {
        this.filePath = path.join(__dirname, '../data/cancelations.json');
        this.cancellations = this.loadCancellations();
    }

    loadCancellations() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf8');
                const cancellations = JSON.parse(data);
                return cancellations.map(cancellation => new Cancellation(
                    cancellation.id,
                    cancellation.userId,
                    cancellation.date
                ));
            }
        } catch (err) {
            console.error('Error reading cancellations from file:', err);
        }
        return [
            new Cancellation(1, 1, "")
        ];
    }

    saveCancellation() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.cancellations, null, 2));
        } catch (err) {
            console.error('Error writing cancellations to file:', err);
        }
    }

    getAllCancellations() {
        return this.cancellations;
    }

    getCancellationById(id) {
        return this.cancellations.find(cancellation => cancellation.id === id);
    }

    addCancellation(userId, date) {
        const maxId = this.cancellations.reduce((max, cancellation) => (cancellation.id > max ? cancellation.id : max), 0);
        const newId = maxId + 1;
        const newCancellation = new Cancellation(newId, userId, date);
        this.cancellations.push(newCancellation);
        this.saveCancellation();
        return newCancellation;
    }
}

module.exports = new CancellationService();

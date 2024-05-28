const factoryService = require('../services/factoryService');

exports.getAllFactories = (req,res) => {
    const factories = factoryService.getAllFactories();
    res.json(factories);
};

exports.addFactory = (req, res) => {
    const { name, workingHours, status, location, logoPath, rating } = req.body;

    
    if (!name || !location || !status) {
        return res.status(400).json({ error: 'Name, location, and status are required' });
    }

    try {
        const newFactory = factoryService.addFactory(name, workingHours, status, location, logoPath, rating);
        res.status(201).json(newFactory);
    } catch (error) {
        console.error('Error adding factory:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteFactoryById = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Factory ID is required' });
    }

    try {
        const deleted = factoryService.deleteFactoryById(Number(id));
        if (deleted) {
            res.status(200).json({ message: 'Factory deleted successfully' });
        } else {
            res.status(404).json({ error: 'Factory not found' });
        }
    } catch (error) {
        console.error('Error deleting factory:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getFactoryById = (req, res) => {
    const { factoryId } = req.params;

    if (!factoryId) {
        return res.status(400).json({ error: 'Factory ID is required' });
    }

    try {
        const factory = factoryService.getFactoryById(Number(factoryId));
        if (factory) {
            res.status(200).json(factory);
        } else {
            res.status(404).json({ error: 'Factory not found' });
        }
    } catch (error) {
        console.error('Error finding factory:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

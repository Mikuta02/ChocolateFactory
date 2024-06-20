const factoryService = require('../services/factoryService');

exports.getAllFactories = (req, res) => {
    const factories = factoryService.getAllFactories();
    res.json(factories);
};

exports.addFactory = async (req, res) => {
    const { name, workingHours, status, latitude, longitude, address, logoPath, rating } = req.body;

    if (!name || !address || !status || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: 'Name, address, status, latitude, and longitude are required' });
    }

    const addressRegex = /^[a-zA-Z0-9\s,.'-]+, [a-zA-Z\s]+,?\s*\d{5}$/;
    console.log('Address:', address); // Dodan ispis za debug
    if (!addressRegex.test(address)) {
        return res.status(400).json({ error: 'Invalid address format (e.g., Ulica 123, Grad, 11000 or Ulica 123, Grad 11000)' });
    }

    if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: 'Latitude and longitude must be numbers' });
    }

    try {
        const newFactory = factoryService.addFactory(
            name, 
            workingHours, 
            status, 
            parseFloat(latitude), 
            parseFloat(longitude), 
            address,
            logoPath, 
            rating
        );
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
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Factory ID is required' });
    }

    try {
        const factory = factoryService.getFactoryById(Number(id));
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

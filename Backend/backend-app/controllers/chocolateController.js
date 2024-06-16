const chocolateService = require('../services/chocolateService');

exports.addChocolate = (req, res) => {
    const { name, price, chocolateType, factoryId, chocolateVariety, grams, description, picturePath, status, amount } = req.body;

    // if (!name || !price || !chocolateType || !factoryId || !chocolateVariety || !grams || !description || !picturePath || !amount || !status) {
    //     return res.status(400).json({ error: 'All fields are required' });
    // }

    try {
        const newChocolate = chocolateService.addChocolate(name, price, chocolateType, factoryId, chocolateVariety, grams, description, picturePath, status, amount);
        res.status(201).json(newChocolate);
    } catch (error) {
        console.error('Error adding chocolate:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteChocolateById = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Chocolate ID is required' });
    }

    try {
        const deleted = chocolateService.deleteChocolateById(Number(id));
        if (deleted) {
            res.status(200).json({ message: 'Chocolate deleted successfully' });
        } else {
            res.status(404).json({ error: 'Chocolate not found' });
        }
    } catch (error) {
        console.error('Error deleting Chocolate:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getChocolatesByFactoryId = (req, res) => {
    const { factoryId } = req.query;

    if (!factoryId) {
        return res.status(400).json({ error: 'Factory ID is required' });
    }

    try {
        const chocolates = chocolateService.getChocolateByFactoryId(Number(factoryId));
        res.status(200).json(chocolates);
    } catch (error) {
        console.error('Error finding Chocolates:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateChocolate = (req, res) => {
    const { id } = req.params;
    const { name, price, chocolateType, factoryId, chocolateVariety, grams, description, picturePath, status, amount } = req.body;

    const updatedChocolate = {
        id: Number(id),  
        name,
        price,
        chocolateType,
        factoryId: Number(factoryId), 
        chocolateVariety,
        grams,
        description,
        picturePath,
        status,
        amount
    };

    try {
        const result = chocolateService.updateChocolate(Number(id), updatedChocolate);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: 'Chocolate not found' });
        }
    } catch (error) {
        console.error('Error updating chocolate:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


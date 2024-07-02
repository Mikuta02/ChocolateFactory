const customerTypeService = require('../services/customerTypeService');

exports.getTypes = (req, res) => {
    const types = customerTypeService.getAllTypes();
    res.json(types);
};
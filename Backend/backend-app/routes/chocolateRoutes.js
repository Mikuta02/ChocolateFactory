const express = require('express');
const router = express.Router();
const chocolateController = require('../controllers/chocolateController');

router.get('/chocolates', chocolateController.getChocolatesByFactoryId);
router.post('/chocolates', chocolateController.addChocolate);
router.delete('/chocolates/:id', chocolateController.deleteChocolateById);

module.exports = router;
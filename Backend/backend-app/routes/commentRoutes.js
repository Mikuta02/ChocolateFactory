const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authenticate = require('../middleware/check-auth');

router.post('/comments', authenticate, commentController.addComment);
router.post('/comments/update-status', authenticate, commentController.updateCommentStatus);
router.get('/comments/factory/:factoryId', commentController.getCommentsByFactoryId);
router.get('/comments/factory/:factoryId/all', authenticate, commentController.getAllCommentsByFactoryId);

module.exports = router;

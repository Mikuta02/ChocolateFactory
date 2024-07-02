const commentService = require('../services/commentService');

exports.addComment = (req, res) => {
    try {
        const { userId, factoryId, text, rating } = req.body;
        const newComment = commentService.addComment(userId, factoryId, text, rating);
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateCommentStatus = (req, res) => {
    try {
        const { commentId, status } = req.body;
        const updatedComment = commentService.updateCommentStatus(commentId, status);
        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error updating comment status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCommentsByFactoryId = (req, res) => {
    try {
        const { factoryId } = req.params;
        const comments = commentService.getCommentsByFactoryId(factoryId);
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllCommentsByFactoryId = (req, res) => {
    try {
        const { factoryId } = req.params;
        const comments = commentService.getAllCommentsByFactoryId(factoryId);
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

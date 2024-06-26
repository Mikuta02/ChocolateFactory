const commentService = require('../services/commentService');

exports.addComment = (req, res) => {
  try {
    const { userId, factoryId, text, rating } = req.body;
    const newComment = commentService.addComment(userId, factoryId, text, rating);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getCommentsByFactoryId = (req, res) => {
  try {
    const { factoryId } = req.params;
    const comments = commentService.getCommentsByFactoryId(factoryId); // ensure factoryId is string
    res.json(comments);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

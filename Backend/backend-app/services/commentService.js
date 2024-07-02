const fs = require('fs');
const path = require('path');
const Comment = require('../models/commentModel');
const UserService = require('./userService');
const FactoryService = require('./factoryService');

class CommentService {
  constructor() {
    this.filePath = path.join(__dirname, '../data/comments.json');
    this.comments = this.loadComments();
  }

  loadComments() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf8');
        const parsedComments = JSON.parse(data);

        return parsedComments.map(comment => {
          const user = UserService.getUserById(comment.user.id);
          const factory = FactoryService.getFactoryById(comment.factory.id);

          return new Comment(
            comment.id,
            user,
            factory,
            comment.text,
            comment.rating,
            comment.status
          );
        });
      }
    } catch (err) {
      console.error('Error reading comments from file:', err);
    }
    return [];
  }

  saveComments() {
    try {
      const commentsToSave = this.comments.map(comment => ({
        id: comment.id,
        user: {
          id: comment.user.id,
          username: comment.user.username
        },
        factory: {
          id: comment.factory.id,
          name: comment.factory.name
        },
        text: comment.text,
        rating: comment.rating,
        status: comment.status
      }));
      fs.writeFileSync(this.filePath, JSON.stringify(commentsToSave, null, 2));
    } catch (err) {
      console.error('Error writing comments to file:', err);
    }
  }

  addComment(userId, factoryId, text, rating) {
    const newId = this.comments.length ? this.comments[this.comments.length - 1].id + 1 : 1;
    const user = UserService.getUserById(userId);
    const factory = FactoryService.getFactoryById(factoryId);

    if (!user || !factory) {
        throw new Error('Invalid user or factory');
    }

    const newComment = new Comment(newId, user, factory, text, rating, 'pending');
    this.comments.push(newComment);
    this.saveComments();
    return newComment;
  }

  updateCommentStatus(commentId, status) {
    const comment = this.comments.find(c => c.id === commentId);
    if (comment) {
        comment.status = status;
        this.saveComments();
        return comment;
    }
    throw new Error('Comment not found');
  }

  getCommentsByFactoryId(factoryId) {
    return this.comments.filter(comment => comment.factory.id === parseInt(factoryId));
  }

  getAllCommentsByFactoryId(factoryId) {
    console.log(`Filtering comments for factoryId: ${factoryId}`);
    return this.comments.filter(comment => {
      const result = comment.factory && comment.factory.id === parseInt(factoryId);
      console.log(`Comment ID: ${comment.id}, Factory ID: ${comment.factory ? comment.factory.id : 'undefined'}, Result: ${result}`);
      return result;
    });
  }

  getAllComments() {
    return this.comments;
  }
}

module.exports = new CommentService();

const fs = require('fs');
const path = require('path');
const Comment = require('../models/commentModel');
const User = require('../models/userModel');

class CommentService {
  constructor() {
    this.filePath = path.join(__dirname, '../data/comments.json');
    this.comments = this.loadComments();
  }

  loadComments() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(data).map(comment => new Comment(
          comment.id,
          new User(comment.user.id, comment.user.username),
          comment.factory, // izmenjeno sa comment.factoryId
          comment.text,
          comment.rating
        ));
      }
    } catch (err) {
      console.error('Error reading comments from file:', err);
    }
    return [];
  }

  saveComments() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.comments, null, 2));
    } catch (err) {
      console.error('Error writing comments to file:', err);
    }
  }

  addComment(userId, factoryId, text, rating) {
    const newId = this.comments.length ? this.comments[this.comments.length - 1].id + 1 : 1;
    const user = new User(userId, `User${userId}`);
    const newComment = new Comment(newId, user, factoryId.toString(), text, rating); // ensure factoryId is a string
    this.comments.push(newComment);
    this.saveComments();
    return newComment;
  }

  getCommentsByFactoryId(factoryId) {
    return this.comments.filter(comment => comment.factory === factoryId.toString()); // filter by string
  }
}

module.exports = new CommentService();

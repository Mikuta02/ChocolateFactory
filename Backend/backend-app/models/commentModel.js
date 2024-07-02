const User = require('./userModel');
const Factory = require('./factoryModel');

class Comment {
    constructor(id, user, factory, text, rating, status = 'pending') {
        this.id = id;
        this.user = user;
        this.factory = factory;
        this.text = text;
        this.rating = rating;
        this.status = status; // "pending", "approved", "rejected"
    }
}

module.exports = Comment;
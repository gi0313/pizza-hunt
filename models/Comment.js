const{Schema, model} = require('mongoose');

const CommentSchema = new Schema({
    writtenBy: {
        type: String
    },
    commentBody: {
        typr: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment =model('Comment', CommentSchema);

module.exports = Comment;
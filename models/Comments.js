const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    text: String,
},{
    timestamps: true,
});

const Comments = mongoose.model('Comment', commentsSchema);
module.exports = Comments;
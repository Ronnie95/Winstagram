//import mongoose library 
const mongoose = require('mongoose');
//new comment schema 
const commentsSchema = new mongoose.Schema({
    //user field for user associated with leaving comment
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    //post associated with comment 
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    //text field for comment 
    text: String,
},{
    timestamps: true,
});

const Comments = mongoose.model('Comment', commentsSchema);
module.exports = Comments;
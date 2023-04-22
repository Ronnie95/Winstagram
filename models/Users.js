//imports mongo
const mongoose = require('mongoose');
//creates new mongoose schema 
const usersSchema = new mongoose.Schema({
    //username field for schema, is required 
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    //defines email field
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    //defines password, is mandatory 
    password: {
        type: String,
        required: true,
    },
    fullName:{
        type: String,
        trim: true,
    },
    profilePicture: {
        type: String,
        //default if none is given 
        default: 'what_a_nice_selfie_url',
    },
    bio: {
        type: String,
        trim: true, 
    },
    //array of objects ref by ObjectId
    posts: [{
         //refers to _id field of Post model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }],
    //field for followers/following 
    //
    // followers: [
    //     {   //ref Users by ObjectId to display followers
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'User',
    //     },
    // ],
    // following: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'User',
    //     },
    // ],
}, {
    //timestamps for created & edited times
    timestamps: true,
})
//creates model called Users
const Users = mongoose.model('User', usersSchema);
//exports Users model 
module.exports = Users;
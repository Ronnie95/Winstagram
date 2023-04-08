const mongoose = require('mongoose');

const usersSchema = new moongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
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
        //img url in here
        default: 'what_a_nice_selfie_url',
    },
    bio: {
        type: String,
        trim: true, 
    },
    //arr of followers
    followers: [
        {   //ref Users by ObjectId to display followers
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
}, {
    timestamps: true,
})

const Users = mongoose.model('User', usersSchema);
module.exports = Users;
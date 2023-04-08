const express = require('express');
const router = express.Router();
const { Users } = require('../models');

const seededData = [
    {
        username: "jsmith123",
        email: "jsmith123@gmail.com",
        password: "abc",
        fullName:"John Smith",
        profilePicture: "http://",
        bio: "Hi, I'm John Smith",
        followers: [{}],
        following: [{}],
    }, {
        username: "mindybird246",
        email: "mindybird246@gmail.com",
        password: "efg",
        fullName:"Mindy Bird",
        profilePicture: "http://",
        bio: "Hello, I'm Mindy Bird",
        followers: [{}],
        following: [{}],
    }, {
        username: "jaredhaynes357",
        email: "jaredhaynes357@gmail.com",
        password: "hij",
        fullName:"Jared Haynes",
        profilePicture: "http://",
        bio: "Hello, my name is Jared Haynes",
        followers: [{}],
        following: [{}],
    }
]


router.get('', async (req, res, next) => {
    try {
        const myUsers = await Users.find({});
        console.log(myUsers);
        res.render('users/index.ejs', {Users: myUsers})
    } catch(err) {
        console.log(err);
        next();
    }
});
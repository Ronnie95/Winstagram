const express = require('express');
const router = express.Router();
const { Users } = require('../models');

const seededData = [
    {
        username: "jsmith123",
        email: "jsmith123@gmail.com",
        password: "abc",
        fullName:"John Smith",
        profilePicture: "http://shorturl.at/mtxQ1",
        bio: "Hi, I'm John Smith"
        // followers: [{}],
        // following: [{}],
    }, {
        username: "mindybird246",
        email: "mindybird246@gmail.com",
        password: "efg",
        fullName:"Mindy Bird",
        profilePicture: "http://shorturl.at/aHKW3",
        bio: "Hello, I'm Mindy Bird"
        // followers: [{}],
        // following: [{}],
    }, {
        username: "jaredhaynes357",
        email: "jaredhaynes357@gmail.com",
        password: "hij",
        fullName:"Jared Haynes",
        profilePicture: "http://shorturl.at/bgn79",
        bio: "Hello, my name is Jared Haynes"
        // followers: [{}],
        // following: [{}],
    }
];


router.get('', async (req, res, next) => {
    try {
        const myUsers = await Users.find({});
        console.log(myUsers);
        res.render('users/index', {Users: myUsers});
    } catch(err) {
        console.log(err);
        next();
    }
});

router.get('/seed', async (req, res, next) => {
    try {
        await Users.deleteMany({});
        await Users.insertMany(seededData);
        res.redirect('/users');
    } catch(err) {
        console.log(err);
        next();
    }
})

router.get('/new', (req, res) => {
    res.render('users/new');
})

router.post('', async (req, res, next) => {
    try {
        const newUser = await Users.create(req.body);
        console.log(newUser);
        res.redirect('/users')
    } catch(err) {
        console.log(err);
        next();
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const myUser = await Users.findById(req.params.id);
        console.log(myUser);
        res.render('users/show', {myUser})
    } catch(err) {
        console.log(err);
        next();
    }
})

module.exports = router;
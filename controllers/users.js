const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcryptjs');
const { findByIdAndUpdate } = require('../models/Posts');

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
        let myUsers; 
        const userLoggedIn = req.session.currentUser;
        if (req.query.search) {
            myUsers = await Users.find({username: req.query.search});
            if (parseInt(myUsers.length) == 0) {
                myUsers = await Users.find({});
                res.render('users/index', {Users: myUsers, userLoggedIn});
                return;
            }
            res.redirect(`/users/${myUsers[0]._id}`);
        } else {
            myUsers = await Users.find({});
            res.render('users/index', {Users: myUsers, userLoggedIn});
        }
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

router.get('/signup', (req, res) => {
    const userLoggedIn = req.session.currentUser;
    res.render('users/signup', {userLoggedIn});
});

router.post('/signup', async (req, res, next) => {
    try {
        const newUser = req.body;
        console.log(newUser);
        const rounds = process.env.SALT_ROUNDS;
        const salt = await bcrypt.genSalt(parseInt(rounds));
        console.log(`My salt is ${salt}`);
        const hash = await bcrypt.hash(newUser.password, salt);
        console.log(`My hash is ${hash}`);
        newUser.password = hash;
        console.log(newUser);
        await Users.create(newUser);
        res.redirect('/users/login');
    } catch (err) {
        console.log(err);
        next();
    }
})

router.get('/login', (req, res) => {
    const userLoggedIn = req.session.currentUser;
    res.render('users/login', {userLoggedIn});
});

router.post('/login', async (req, res, next) => {
    try {
        let user;
        const userExists = await Users.exists({email: req.body.email});
        if (userExists) {
            user = await Users.findOne({email: req.body.email});
            console.log(user);
        } else {
            return res.redirect('/users/login');
        }
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            req.session.currentUser = {
                id: user._id,
                username: user.username
            };
            console.log(req.session);
            console.log(match);
            console.log(userExists);
            res.redirect(`/users/${user._id}`);
        } else {
            res.redirect('/users/login');
        }
    } catch (err) {
        console.log(err);
        next();
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/users/login');
})

router.get('/:id', async (req, res, next) => {
    try {
        const myUser = await Users.findById(req.params.id);
        const userLoggedIn = req.session.currentUser;
        res.render('users/show', {myUser, userLoggedIn})
    } catch(err) {
        console.log(err);
        next();
    }
})

router.get('/:id/edit', async (req, res, next) => {
    try {
        const userToBeEdited = await Users.findById(req.params.id);
        const userLoggedIn = req.session.currentUser;
        if (req.session.currentUser && req.session.currentUser.id == userToBeEdited._id.toString()) {
            res.render('users/edit', {user: userToBeEdited, userLoggedIn})
        } else {
            res.redirect('/error')
        }
    } catch(err) {
        console.log(err);
        next()
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const updatedUser = await Users.findByIdAndUpdate(req.params.id, req.body);
        if (req.session.currentUser && req.session.currentUser.id == updatedUser._id.toString()) {
            res.redirect(`/users/${req.params.id}`)
        } else {
            res.redirect('/error')
        }
    } catch(err) {
        console.log(err);
        next();
    }
})

router.get('/:id/edit/password', async (req, res, next) => {
    try {
        const userToBeEdited = await Users.findById(req.params.id);
        const userLoggedIn = req.session.currentUser;
        if (req.session.currentUser && req.session.currentUser.id == userToBeEdited._id.toString()) {
            res.render('users/password', {user: userToBeEdited, userLoggedIn})
        } else {
            res.redirect('/error')
        }
    }
    catch (err) {
        console.log(err);
        next();
    }
})

router.put('/:id/password', async (req, res, next) => {
    try {
        const newPassword = req.body;
        console.log(newPassword);
        const rounds = process.env.SALT_ROUNDS;
        const salt = await bcrypt.genSalt(parseInt(rounds));
        console.log(`My salt is ${salt}`);
        const hash = await bcrypt.hash(newPassword.password, salt);
        console.log(`My hash is ${hash}`);
        newPassword.password = hash;     
        let updatedUser = await Users.findById(req.params.id);
        let updatedUserObject = {
            username: updatedUser.username,
            email: updatedUser.email,
            password: newPassword.password,
            bio: updatedUser.bio,
            profilePicture: updatedUser.profilePicture
        };
        await Users.findByIdAndUpdate(req.params.id, updatedUserObject);       
        res.redirect(`/users/${req.params.id}`);
    }
    catch (err) {
        console.log(err);
        next();
    }
})

router.get('/:id/delete', async (req, res, next) => {
    try {
        const userToBeDeleted = await Users.findById(req.params.id);
        const userLoggedIn = req.session.currentUser;
        if (req.session.currentUser && req.session.currentUser.id == userToBeDeleted._id.toString()) {
            res.render('users/delete', {user: userToBeDeleted, userLoggedIn})
        } else {
            res.redirect('/error');
        }
    } catch(err) {
        console.log(err);
        next();
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Users.findByIdAndDelete(req.params.id);
        if (req.session.currentUser && req.session.currentUser.id == deletedItem._id.toString()) {
            res.redirect('/users');
        } else {
            res.redirect('/error');
        }
    } catch(err) {
        console.log(err);
        next();
    }
})

module.exports = router;
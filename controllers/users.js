//express module 
const express = require('express');
//router to define user routes
const router = express.Router();
//imort users model
const { Users } = require('../models');
//import module for password hashing 
const bcrypt = require('bcryptjs');

//array of users objects to seed MongoDB
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

//route for users root path, takes three arguments 
router.get('', async (req, res, next) => {
    try {
        //local variable 
        let myUsers; 
        //current user from session
        const userLoggedIn = req.session.currentUser;
        //search through Users model using find.()
        if (req.query.search) {
            myUsers = await Users.find({username: req.query.search});
            //if no username matches execute: 
            if (parseInt(myUsers.length) == 0) {
                myUsers = await Users.find({});
                //rendser user index if no user found & sets myUser to all
                res.render('users/index', {Users: myUsers, userLoggedIn});
                return;
            }
            //if search returns result, redirect to user url
            res.redirect(`/users/${myUsers[0]._id}`);
        } else {
            //if no search is entered, MyUser is set to all users 
            myUsers = await Users.find({});
            res.render('users/index', {Users: myUsers, userLoggedIn});
        }
    //handles errors & next middleware function
    } catch(err) {
        console.log(err);
        next();
    }
});
//route to seed databse
router.get('/seed', async (req, res, next) => {
    try {
        //deletes all existing users in db
        await Users.deleteMany({});
        //inserts Users as defined in seededData arr
        await Users.insertMany(seededData);
        //redirect to /users
        res.redirect('/users');
        //calls if error 
    } catch(err) {
        console.log(err);
        next();
    }
})
//route for signup
router.get('/signup', (req, res) => {
    //sets userLoggedIn to currentUser from req.session
    const userLoggedIn = req.session.currentUser;
    //renders signup.ejs & userLoggedIn displayed in view
    res.render('users/signup', {userLoggedIn});
});
//hanndles signup submission
router.post('/signup', async (req, res, next) => {
    try {
        //retrieves newUser data from req.body
        const newUser = req.body;
        //num of salt rounds from .env
        const rounds = process.env.SALT_ROUNDS;
        //gens salt for hashing using bcrypt 
        const salt = await bcrypt.genSalt(parseInt(rounds));
        //gens hash, takes two arguments; password & salt 
        const hash = await bcrypt.hash(newUser.password, salt);
        //hash of new users password 
        newUser.password = hash;
        //new user object created in mongoDB
        await Users.create(newUser);
        //redirected to log in page
        res.redirect('/users/login');
    } catch (err) {
        console.log(err);
        next();
    }
})
//route for login
router.get('/login', (req, res) => {
    //current user from req.sessions
    const userLoggedIn = req.session.currentUser;
    //renders login.ejs & userLoggedIn
    res.render('users/login', {userLoggedIn});
});
//login route end point 
router.post('/login', async (req, res, next) => {
    try {
        //variable to hold user object
        let user;
        //checks if user with given email exists in DB using .exists() of Users model
        const userExists = await Users.exists({email: req.body.email});
        //if user exists 
        if (userExists) {
            //retrieves user object using findOne 
            user = await Users.findOne({email: req.body.email});
        } else {
            //if user doesnt exist redirect to log in page
            return res.redirect('/users/login');
        }
        //handles if passwords match 
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            //sets currentUser object to object containing ID & username of the logged in user 
            req.session.currentUser = {
                id: user._id,
                username: user.username
            };
            //redirects user to their profile page 
            res.redirect(`/users/${user._id}`);
        } else {
            //redirect to log in page 
            res.redirect('/users/login');
        }
    } catch (err) {
        console.log(err);
        next();
    }
})
//route for logout 
router.get('/logout', (req, res) => {
    //user session is destroyed
    req.session.destroy();
    //redirect to log in 
    res.redirect('/users/login');
})
//route for user profile 
router.get('/:id', async (req, res, next) => {
    try {
        //find my User by Users model Id & .populate() user posts from Posts model
        const myUser = await Users.findById(req.params.id).populate('posts');
        //sets userLoggedIn to current user from req.session
        const userLoggedIn = req.session.currentUser;
        //render users/show.ejs & pass MyUser, UserLogged in
        res.render('users/show', {myUser, userLoggedIn})
    } catch(err) {
        console.log(err);
        next();
    }
})
//edit :id route
router.get('/:id/edit', async (req, res, next) => {
    try {
        //sets userTobeEdited to user with corresponding Id from DB
        const userToBeEdited = await Users.findById(req.params.id);
        //retrieves current user from session 
        const userLoggedIn = req.session.currentUser;
        //if current user & user to be edited ==
        if (req.session.currentUser && req.session.currentUser.id == userToBeEdited._id.toString()) {
            //if true, render: 
            res.render('users/edit', {user: userToBeEdited, userLoggedIn})
        //if not true render error
        } else {
            res.redirect('/error')
        }
    } catch(err) {
        console.log(err);
        next()
    }
})
//put request for updating
router.put('/:id', async (req, res, next) => {
    try {
        //calls updatedUser by Id
        const updatedUser = await Users.findByIdAndUpdate(req.params.id, req.body);
        //if called checks if current user is logged in & if updated user id matches current user Id
        if (req.session.currentUser && req.session.currentUser.id == updatedUser._id.toString()) {
            //if true redirect to user show page
            res.redirect(`/users/${req.params.id}`)
            //else return error
        } else {
            res.redirect('/error')
        }
    } catch(err) {
        console.log(err);
        next();
    }
})
//route for users to update password 
router.get('/:id/edit/password', async (req, res, next) => {
    try {
        //user to edit searched in DB by Id
        const userToBeEdited = await Users.findById(req.params.id);
        //user info from currenUser 
        const userLoggedIn = req.session.currentUser;
        //if user logged in & has same Id as user to be edited 
        if (req.session.currentUser && req.session.currentUser.id == userToBeEdited._id.toString()) {
            //if true render:
            res.render('users/password', {user: userToBeEdited, userLoggedIn})
        //if false render error
        } else {
            res.redirect('/error')
        }
    }
    catch (err) {
        console.log(err);
        next();
    }
})
//pur routw for updating password 
router.put('/:id/password', async (req, res, next) => {
    try {
        //new pw from user submitted data in req.body
        const newPassword = req.body;
        //num of salt rounds from .env
        const rounds = process.env.SALT_ROUNDS;
        //gens salt from num of rounds
        const salt = await bcrypt.genSalt(parseInt(rounds));
        //hash of new pw using salt
        const hash = await bcrypt.hash(newPassword.password, salt);
        //replaces plain text pw w hashed in object
        newPassword.password = hash;  
        //finds user by Id and assigns to variable
        let updatedUser = await Users.findById(req.params.id);
        //creates object for updated user w/new pw
        let updatedUserObject = {
            username: updatedUser.username,
            email: updatedUser.email,
            password: newPassword.password,
            bio: updatedUser.bio,
            profilePicture: updatedUser.profilePicture
        };
        //updates user with the specified Id
        await Users.findByIdAndUpdate(req.params.id, updatedUserObject);  
        //redirects to users profile page     
        res.redirect(`/users/${req.params.id}`);
    }
    catch (err) {
        console.log(err);
        next();
    }
})
//route for confirming delete user 
router.get('/:id/delete', async (req, res, next) => {
    try {
        //retrievers user with Id and assigns to userToBeDeleted var
        const userToBeDeleted = await Users.findById(req.params.id);
        //retrivers current user using req.sessions
        const userLoggedIn = req.session.currentUser;
        //iff current user is logged in & if user id = user to be deleted id 
        if (req.session.currentUser && req.session.currentUser.id == userToBeDeleted._id.toString()) {
            //if true render delete confirmation page
            res.render('users/delete', {user: userToBeDeleted, userLoggedIn})
        //else render error.ejs
        } else {
            res.redirect('/error');
        }
    } catch(err) {
        console.log(err);
        next();
    }
})
//route for deleting user from database
router.delete('/:id', async (req, res) => {
    try {
        //find and delete user with given Id
        const deletedItem = await Users.findByIdAndDelete(req.params.id);
        //if Id of current user matches Id of deletes user then auth to delete 
        if (req.session.currentUser && req.session.currentUser.id == deletedItem._id.toString()) {
            //if auth redirect to users page
            res.redirect('/users');
        //if not then error
        } else {
            res.redirect('/error');
        }
    } catch(err) {
        console.log(err);
        next();
    }
})
//router exported for use in app
module.exports = router;
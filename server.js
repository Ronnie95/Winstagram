//loads dotenv & runs config to load env var from .env to process.env
require('dotenv').config();
//import express module & create app instance
const express = require('express');
const app = express();
//port that server will listen to 
const PORT = 4000;
//imports method-override
const methodOverride = require('method-override')
//imports three controller modules req for routes
const postsController = require('./controllers/posts')
const usersController = require('./controllers/users')
const commentsController = require('./controllers/comments')
//imports modules used to manage user sessions & store data in MongoDB
const session = require('express-session');
const MongoStore = require('connect-mongo');
//sets view engine to ejs to allow JS in HTML
app.set('view engine', 'ejs');
//mainly for css
app.use(express.static('public'));
//uses session to set up MongoStore
app.use(
    session({
        //create new session to store data in mongoDB
        store: MongoStore.create({ 
            mongoUrl: process.env.MONGO_DB_URI
        }),
        //used to sign session ID to avoid shady cookie trouble
        secret: process.env.SECRET,
        //avoid saving unecessary session data in store
        resave: false,
        //avoids saving empty sessions to store 
        saveUninitialized: false,
        //max age of sessionID cookie in milliseconds
        cookie: {
            maxAge: 1000 * 60 * 60
        }
    }),
)
//middleware for parsing URL enconded request, 
//false selects selects classic encoding method, values = strings || arrays
app.use(express.urlencoded({ extended:false }));
//sets middleware to use _method
app.use(methodOverride('_method'))
//route for home page 
app.get('/', (req, res) => {
    //checks if user is logged in & passes variable to view
    const userLoggedIn = req.session.currentUser;
    //render home.ejs
    res.render('home.ejs', {userLoggedIn});
})
//sets up routes for three diff controllers
app.use('/users', usersController);
app.use('/users/:userId/posts', postsController);
app.use('/users/:userId/posts/:postId/comments', commentsController);
//starts express server & listens for incoming req on port 4000
app.listen(PORT, () => {
    //message console logged on server start
    console.log(`$ 💲 ＄ Server is listening to PORT ${PORT} 🤳🤳🤳 `)
})
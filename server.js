require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 4000;
const methodOverride = require('method-override')
const postsController = require('./controllers/posts')
const usersController = require('./controllers/users')
const commentsController = require('./controllers/comments')
const mongoose = require('mongoose');

const session = require('express-session');
const MongoStore = require('connect-mongo');

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(
    session({
        store: MongoStore.create({ 
            mongoUrl: process.env.MONGO_DB_URI
        }),
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60
        }
    }),
)

app.use(express.urlencoded({ extended:false }));

app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    const userLoggedIn = req.session.currentUser;
    res.render('home.ejs', {userLoggedIn});
})

app.use('/users', usersController);
app.use('/users/:userId/posts', postsController);
// app.use('/users/:userId/posts/:postsId', commentsController);
app.listen(PORT, () => {
    console.log(`$ 💲 ＄ Server is listening to PORT ${PORT} 🤑 💵 💰`)
})
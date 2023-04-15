const express = require('express');
const app = express();
const PORT = 4000;
const methodOverride = require('method-override')
const postsController = require('./controllers/posts')
const usersController = require('./controllers/users')
const commentsController = require('./controllers/comments')
const mongoose = require('mongoose');


app.set('view engine', 'ejs');

app.use(express.static('public'));


app.use(express.urlencoded({ extended:false }));

app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    console.log("test")
    // res.render('home.ejs')
})


app.use('/', postsController);
// app.use('/', usersController);
//app.use('/, commentsController);
app.listen(PORT, () => {
    console.log(`$ 💲 ＄ Server is listening to PORT ${PORT} 🤑 💵 💰`)
})
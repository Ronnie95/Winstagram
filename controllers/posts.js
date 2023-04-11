const express = require('express');
const router = express.Router();
const { Posts } = require('../models');


router.get('', async (req, res, next) => {
    try {
        const myPosts = await Posts.find({});
        console.log(myPosts);
        res.render('Posts/index.ejs', {Posts: myPosts})
    } catch(err) {
        console.log(err);
        next();
    }
});
//route to create new post 
router.get('/new', (req, res) => {
    res.render('posts/new.ejs');
})

router.post('', async (req, res, next) => {
   try {
    const newPost = await Posts.create(req.body);
    res.redirect('/posts')
   } catch(err) {
    console.log(err);
    next();
   }
})

// router.get('/:id', async (req, res, next) => {
//     try {
//         const post = await Posts.findById(req.params.id);
//         res.render
//     }
// })

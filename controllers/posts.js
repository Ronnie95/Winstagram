const express = require('express');
const router = express.Router();
const { Posts } = require('../models');


router.get('/:userId', async (req, res, next) => {
    try {
        const myPosts = await Posts.find({});
        console.log(myPosts);
        res.render('posts/index', {Posts: myPosts})
    } catch(err) {
        console.log(err);
        next();
    }
});
//route to create new post 
router.get('/:userId/new', (req, res) => {
    res.render('posts/new');
})

router.get('/:userId/:id', async (req, res, next) => {
    try {
        
        const myPost = await Posts.findById(req.params.id);
        console.log(mypost);
        res.render('posts/show', {post: myPost})
    } catch(err) {
        console.log(err);
        next();
    }
})


router.post('/:userId', async (req, res, next) => {
   try {
    const newPost = await Posts.create(req.body);
    res.redirect(`/users/${req.params.userId}/posts`)
   } catch(err) {
    console.log(err);
    next();
   }
})

router.get('/:userId/:id/edit', async (req, res, next) => {
    try {
        const postToBeEdited = await Posts.findById(req.params.id);
        console.log(postToBeEdited);
        res.render('posts/edit', {post: postToBeEdited})
    } catch(err) {
        console.log(err);
        next()
    }
})

router.put('/:userId/:id', async (req, res, next) => {
    try {
       const updatedPost = await Posts.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/users/${req.params.userId}/posts/${req.params.id}`)
    } catch(err) {
        console.log(err);
        next();
    }
})

router.get('/:userId/:id/delete', async (req, res, next) => {
    try {
        const postoBeDeleted = await Posts.findById(req.params.id);    
        res.render('posts/delete.ejs', {post: postoBeDeleted})
    } catch(err) {
        console.log(err);
        next();
    }
})
router.delete('/:userId/:id', async (req, res) => {
    try {
        const deletedPost = await Posts.findByIdAndDelete(req.params.id);
        // console.log(deletedPost);
        res.redirect(`/users/${req.params.userId}/posts`);
    } catch(err) {
        console.log(err);
        next();
    }
})


module.exports = router;


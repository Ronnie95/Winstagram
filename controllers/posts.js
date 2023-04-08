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
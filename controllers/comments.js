const express = require('express');
const router = express.Router();
const { Comments } = require('../models');


//root route that fetches all comments from DB and renders using Comments/index.ejs
router.get('', async (req, res, next) => {
    try {
        const myComments = await Comments.find({});
        console.log(myComments);
        res.render('comments/index.ejs', {Comments: myComments})
    //if error occurs, logs error
    } catch(err) {
        console.log(err);
    //passes to next middleware 
        next();
    }
});

router.post('', async (req, res, next) => {
    try {
        console.log("line 22 comments.js")
        const newComments = await Comments.create(req.body);
        console.log(newComments);
        res.redirect(`/comments`)
    
    } catch(err) {
        console.log(err);
        next();
    }
});


router.get('/:id', async (req, res, next) => {
    try {
        const editComment = await Comments.findById(req.params.id);
        res.render(`comments/edit.ejs`, {edit :editComment} )
    }
    catch(err) {
        next()
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const updateComment = await Comments.findByIdAndUpdate(req.params.id, req.body);
        res.render(`/comments`, {update : updateComment})
    }
    catch(err) {
        next()
    }
});


router.get('/new', (req, res) => {
    res.render(`comments/new.ejs`)
});



router.get('/:id', async (req, res, next) => {
    try {
        const myComment = await Comments.findById(req.params.id);
        res.render(`comments/show.ejs`, {comment :myComment} )
    }
    catch(err) {
        next()
    }
});

// router.post('', async (req, res, next) => {
//     try{
//         const commentNew = await Comments.create(req.body);
//         res.redirect('/comments')
//     }
//     catch(err){
//         next()
//     }
// });


module.exports = router;
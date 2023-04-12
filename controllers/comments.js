const express = require('express');
const router = express.Router();
const { Comments } = require('../models');


//root route that fetches all comments from DB and renders using Comments/index.ejs
router.get('/comments', async (req, res, next) => {
    try {
        const myComments = await Comments.find({});
        console.log(myComments);
        res.render('Comments/index.ejs', {Comments: myComments})
    //if error occurs, logs error
    } catch(err) {
        console.log(err);
    //passes to next middleware 
        next();
    }
});

router.get('/comments/new', (req, res) => {
    res.render(`comments/new.ejs`)
});



router.get('/:id', async (req, res, next) => {
    try {
        const myComment = await Comments.findById(req.params.id);
        res.render('/comments/show.ejs', {myComment} )
    }
    catch(err) {
        next()
    }
});

router.post('', async (req, res, next) => {
    try{
        const commentNew = await Comments.create(req.body);
        res.redirect('/comments')
    }
    catch(err){
        next()
    }
});


module.exports = router;
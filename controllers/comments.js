const express = require('express');
const router = express.Router();
const { Comments } = require('../models');


//root route that fetches all comments from DB and renders using Comments/index.ejs
router.get('', async (req, res, next) => {
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
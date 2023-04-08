const express = require('express');
const router = express.Router();
const { Users } = require('../models');



router.get('', async (req, res, next) => {
    try {
        const myUsers = await Users.find({});
        console.log(myUsers);
        res.render('Users/index.ejs', {Users: myUsers})
    } catch(err) {
        console.log(err);
        next();
    }
});
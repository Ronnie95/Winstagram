//imports express & creates instance of router
const express = require('express');
const router = express.Router();
//import Posts/Users from models 
const { Posts, Users } = require('../models');




//route to create new post 
router.get('/new', (req, res) => {
    try {
        //currently logged in user from req.session and lets to userLoggedIn 
        const userLoggedIn = req.session.currentUser;
        //ifUser is logged in can make post
        if (userLoggedIn) {
            //if user is logged in render posts/new.ejs
            res.render('posts/new', { userLoggedIn});
        } else {
            //if not logged in render users/login:
            res.redirect('/users/login');
        }
    } catch (err) {
        console.log(err);
        next();
    }
});
//route to get postId
router.get('/:postId', async (req, res, next) => {
    try {
        //post findById to find post in URL parameter 
        const post = await Posts.findById(req.params.postId)
            //populate to include username from User
            .populate({ path: 'user', select: 'username' })
            //populate to include username from Comments 
            .populate({ path: 'comments', populate: { path: 'user', select: 'username' } });
        //current user and stores in variable 
        const userLoggedIn = req.session.currentUser;
        if (post) {
            //if there is a post with specified Id render:
            res.render('posts/show', { post, userLoggedIn });
            //if no post with Id render error
        } else {
            //redirect error page
            res.redirect('/error');
        }
    } catch (err) {
        console.log(err);
        next();
    }
});

router.post('/', async (req, res, next) => {
    try {
        //logged in user from req.session current user
        const userLoggedIn = req.session.currentUser;
        //sets user field of body to logged in user id
        req.body.user = userLoggedIn.id;
        //creates new post in db using req.body
        const newPost = await Posts.create(req.body);
        // Update the user's posts array
        const user = await Users.findById(userLoggedIn.id);
        //adds id of new post to posts array of user 
        user.posts.push(newPost._id);
        //saves updated user data to db
        await user.save();
        //redirect to user profile page
        res.redirect(`/users/${userLoggedIn.id}`);
    } catch (err) {
        console.log(err);
        next();
    }
});
 //route to edit post 
router.get('/:postId/edit', async (req, res, next) => {
    try {
    //sets post to be edited to post matching Id in Posts model 
      const postToBeEdited = await Posts.findById(req.params.postId);
      //sets current session user to userLoggedIn
      const userLoggedIn = req.session.currentUser;
    if (userLoggedIn) {
        //if true, render: 
        res.render('posts/edit', { post: postToBeEdited, userLoggedIn})
    //if not true render error
    } else {
        res.redirect('/error')}
    } catch(err) {
      console.log(err);
      next()
    }
});

router.put('/:postId', async (req, res, next) => {
    try {
        //holds updated Post object & updates in req.body
        const updatedPost = await Posts.findByIdAndUpdate(req.params.postId, req.body);
        //redirects to post show page
        res.redirect(`/users/${req.params.userId}/posts/${req.params.postId}`);
      } catch(err) {
        console.log(err);
        next();
      }
  });
//route to delete a post 
router.get('/:postId/delete', async (req, res, next) => {
    try {
        //finds post by Id in Posts
        const post = await Posts.findById(req.params.postId);
        //sets current user from req.session to userLoggedin
        const userLoggedIn = req.session.currentUser;
        //renders posts/delete & passes post/userLoggedIn for views
        res.render('posts/delete', { post, userLoggedIn });
      } catch (err) {
        console.log(err);
        next();
      }
})
//post route to handle delete requests
router.delete('/:postId', async (req, res) => {
    try {
        //finds Post by Id in db and stores in post variable
        const post = await Posts.findById(req.params.postId);
        //gets userId associated with post
        const userId = post.user.toString();
       //finds post by ID and deletes from DB
        await Posts.findByIdAndDelete(post._id);
        
        //calls post user
        const user = await Users.findById(userId);
        //removes post ID from users posts array
        user.posts.pull(post._id);
        //saves and updates user object in DB
        await user.save();
        //redirects to users show page 
        res.redirect(`/users/${userId}`);
    } catch(err) {
        console.log(err);
        next();
    }
})

//exports for use in app
module.exports = router;


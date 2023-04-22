//imports express library 
const express = require('express');
//allows router to access params in parent router (:postID)
//necessary for comment edit/delete routes 
const router = express.Router({ mergeParams: true });
//imports models
const { Posts, Comments } = require('../models');

//post route 
router.post('/', async (req, res, next) => {
  try {
    //grabs userId & postId from req.body 
    //an object from form dara 
    const { userId, postId } = req.body;
    //userLoggein in from req.session
    const userLoggedIn = req.session.currentUser;
    //new comment object in DB 
    const newComment = await Comments.create({
      //comment object with the following properties:  
      user: userLoggedIn.id,
      username: userLoggedIn.username,
      text: req.body.text,
    });            
    //finds post by postId
    const post = await Posts.findById(postId);
    //adds Id of new comment to the comments array on the post 
    post.comments.push(newComment._id);
    //saves changes in database 
    await post.save();
    //redirects once comment is added 
    res.redirect(`/users/${userId}/posts/${postId}`);
    //for handling errors 
  } catch (err) {
    console.log(err);
    next();
  }
});
//route for editing a comment 
router.get('/:commentId/edit', async (req, res, next) => {
    try {
        //deconstructs value of postId and commentId from req.params
        const { postId, commentId } = req.params;
        //userLoggedIn from req.sessions
        const userLoggedIn = req.session.currentUser;
        //uses commentId to find comment in DB using model/Comments 
        const comment = await Comments.findById(commentId);
        //if comment is not found in DB: 
        if (!comment) {
          throw new Error('Comment not found');
        }
        //renders comment edit 
        res.render('comments/edit', {
          //passes three variables used to display info of comment being edited 
          //necessary for URL in comments/edit.ejs 
          userLoggedIn,
          postId,
          comment,
        });
      } catch (err) {
        console.log(err);
        next(err);
      }
});
//put route for updating comment
router.put('/:commentId', async (req, res, next) => {
  try {
    //decontruct to get params from URL 
    const { userId, postId, commentId } = req.params;
    //updated comment from req.body
    const updatedComment = req.body;
    //finds comment by ID and updates with new comment
    await Comments.findByIdAndUpdate(commentId, updatedComment);
    //redirects to show page after update 
    res.redirect(`/users/${userId}/posts/${postId}`);
  } catch (err) {
    console.log(err);
    next();
  }
});
//route to delete a comment 
router.delete('/:commentId', async (req, res, next) => {
  try {
    //three params from URL 
    const { userId, postId, commentId } = req.params;
    //find comment by ID in DB and delete 
    await Comments.findByIdAndDelete(commentId);
    //finds post that comment belongs to 
    const post = await Posts.findById(postId);
    //removes the commentsID from the posts comments array using pull 
    post.comments.pull(commentId);
    //saves changes in database 
    await post.save();
    //redirects to post show page 
    res.redirect(`/users/${userId}/posts/${postId}`);
  } catch (err) {
    console.log(err);
    next();
  }
});
//export router for uses in app 
module.exports = router;
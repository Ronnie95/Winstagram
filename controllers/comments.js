const express = require('express');
const router = express.Router({ mergeParams: true });
const { Posts, Users, Comments } = require('../models');

router.post('/', async (req, res, next) => {
  try {
    const { userId, postId } = req.body;
    const userLoggedIn = req.session.currentUser;

    const newComment = await Comments.create({
      user: userLoggedIn.id,
      username: userLoggedIn.username,
      text: req.body.text,
    });

    const post = await Posts.findById(postId);
    post.comments.push(newComment._id);
    await post.save();

    res.redirect(`/users/${userId}/posts/${postId}`);
  } catch (err) {
    console.log(err);
    next();
  }
});

router.get('/:commentId/edit', async (req, res, next) => {
    try {
        const { userId, postId, commentId } = req.params;
        const userLoggedIn = req.session.currentUser;
        const comment = await Comments.findById(commentId);
        if (!comment) {
          throw new Error('Comment not found');
        }
    
        res.render('comments/edit', {
          userLoggedIn,
          postId,
          comment,
        });
      } catch (err) {
        console.log(err);
        next(err);
      }
});

router.put('/:commentId', async (req, res, next) => {
  try {
    const { userId, postId, commentId } = req.params;
    const updatedComment = req.body;

    await Comments.findByIdAndUpdate(commentId, updatedComment);

    res.redirect(`/users/${userId}/posts/${postId}`);
  } catch (err) {
    console.log(err);
    next();
  }
});

router.delete('/:commentId', async (req, res, next) => {
  try {
    const { userId, postId, commentId } = req.params;

    await Comments.findByIdAndDelete(commentId);

    const post = await Posts.findById(postId);
    post.comments.pull(commentId);
    await post.save();

    res.redirect(`/users/${userId}/posts/${postId}`);
  } catch (err) {
    console.log(err);
    next();
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { Posts, Users } = require('../models');



router.get('/', async (req, res, next) => {
    try {
        const allPosts = await Posts.find({}).populate({ path: 'user', select: 'username' }); 
        res.render('posts/index', { Posts: allPosts });
    } catch(err) {
        console.log(err);
        next();
    }
});
//route to create new post 
router.get('/new', (req, res) => {
    if (req.session && req.session.currentUser) {
        const userId = req.session.currentUser.id;
        res.render('posts/new', { userId: userId });
    } else {
        // Redirect to the login page or show an error message
        res.redirect('/users/login');
    }
});
// router.get('/:id', async (req, res, next) => {
//     try {
//         // Populate the user's posts array when finding the user by their _id
//         const myUser = await Users.findById(req.params.id).populate('posts');
        
//         const userLoggedIn = req.session.currentUser;
        
//         res.render('users/show', { myUser, userLoggedIn });
//     } catch (err) {
//         console.log(err);
//         next();
//     }
router.get('/:postId', async (req, res, next) => {
    try {
        const post = await Posts.findById(req.params.postId)
            .populate({ path: 'user', select: 'username' })
            .populate({ path: 'comments', populate: { path: 'user', select: 'username' } });
        const userLoggedIn = req.session.currentUser;
  
        if (post) {
            res.render('posts/show', { post, userLoggedIn });
        } else {
            res.redirect('/error');
        }
    } catch (err) {
        console.log(err);
        next();
    }
});
router.post('/', async (req, res, next) => {
    try {
        console.log(req.body);

        const userId = req.body.userId;
        req.body.user = userId;

        const newPost = await Posts.create(req.body);

        // Update the user's posts array
        const user = await Users.findById(userId);
        user.posts.push(newPost._id);
        await user.save();

        res.redirect(`/users/${userId}`);
    } catch (err) {
        console.log(err);
        next();
    }
  });
  router.get('/:postId/edit', async (req, res, next) => {
    try {
      const postToBeEdited = await Posts.findById(req.params.postId);
      console.log(postToBeEdited);
      res.render('posts/edit', { post: postToBeEdited, userLoggedIn: req.session.currentUser })
    } catch(err) {
      console.log(err);
      next()
    }
})

router.put('/:postId', async (req, res, next) => {
    try {
        const updatedPost = await Posts.findByIdAndUpdate(req.params.postId, req.body);
        res.redirect(`/users/${req.params.userId}/posts/${req.params.postId}`);
      } catch(err) {
        console.log(err);
        next();
      }
  });

  router.get('/:postId/delete', async (req, res, next) => {
    try {
        const post = await Posts.findById(req.params.postId);
        const userLoggedIn = req.session.currentUser;
        res.render('posts/delete', { post, userLoggedIn });
      } catch (err) {
        console.log(err);
        next();
      }
})
router.delete('/:postId', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.postId);
        const userId = post.user.toString();

        await Posts.findByIdAndDelete(post._id);
        
        // Remove the post from the user's posts array
        const user = await Users.findById(userId);
        user.posts.pull(post._id);
        await user.save();

        res.redirect(`/users/${userId}`);
    } catch(err) {
        console.log(err);
        next();
    }
})


module.exports = router;


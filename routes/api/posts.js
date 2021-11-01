const express = require('express');
const { body, check, param, validationResult } = require('express-validator');
const router = express.Router();
const validationCheck = require('../../middleware/validationCheck');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Post = require('../../models/Post');

// @route  POST api/posts
// @desc   create a new post
// @access Private
router.post(
  '/',
  [
    auth,
    check('title', 'Post must have a title').trim().not().isEmpty(),
    check('content', 'Post must have content').trim().not().isEmpty(),
    validationCheck,
  ],
  async (req, res) => {
    //get user
    const user = req.user;
    //get post title & content, create a post object
    const { title, content } = req.body;
    let newPost = { user: user.id, title, content };

    try {
      newPost = new Post(newPost);

      const post = await newPost.save();

      res.json(post);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  }
);

// @route  PUT api/posts/:id
// @desc   edit a post
// @access Private
router.put(
  '/:id',
  [
    auth,
    check('title', 'Post must have a title').trim().not().isEmpty(),
    check('content', 'Post must have content').trim().not().isEmpty(),
    validationCheck,
  ],
  async (req, res) => {
    //get user
    const user = req.user;
    //get post title & content, create a post object
    const { title, content } = req.body;
    let newPost = { user: user.id, title, content };

    try {
      //find the current post
      let post = await Post.findById(req.params.id);

      //if no post found
      if (!post) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Post does not exist' }] });
      }

      //if user is not authorized
      if (post.user != req.user.id) {
        return res.status(401).json({ errors: [{ msg: 'Access Denied' }] });
      }

      //post does exist and belongs to the user, edit it
      post.title = title;
      post.content = content;

      post = await post.save();

      res.json(post);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  }
);

// @route  GET api/posts
// @desc   get all posts
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    //get all the posts
    let posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// @route  GET api/posts/:id
// @desc   get a post by id
// @access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const postId = req.params.id;

    //try to find the post
    const post = await Post.findById(postId);

    //if no post found
    if (!post) {
      return res.status(404).json({ errors: [{ msg: 'Post does not exist' }] });
    }

    res.json(post);
  } catch (error) {
    console.log(error);
    if (error.kind == 'ObjectId') {
      res.status(404).json({ errors: [{ msg: 'Post does not exist' }] });
    }
    res.status(500).send('Server Error');
  }
});

// @route  DELETE api/posts/:id
// @desc   delete a post by id
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const postId = req.params.id;

    //try to find the post
    const post = await Post.findById(postId);

    //if no post found
    if (!post) {
      return res.status(404).json({ errors: [{ msg: 'Post does not exist' }] });
    }

    //if user is not authorized
    if (post.user != req.user.id) {
      return res.status(401).json({ errors: [{ msg: 'Access Denied' }] });
    }

    //delete the post
    await post.remove();
    res.send(`Post ${postId} removed`);
  } catch (error) {
    console.log(error);
    if (error.kind == 'ObjectId') {
      res.status(404).json({ errors: [{ msg: 'Post does not exist' }] });
    }
    res.status(500).send('Server Error');
  }
});

// @route  PUT api/posts/like/:id
// @desc   like/unlike a post
// @access Private
router.put(
  '/like/:id',
  [auth, param('id', 'Incorrect post ID').isString(), validationCheck],
  async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId);
      const user = req.user;

      //if no post found
      if (!post) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Post does not exist' }] });
      }

      //get this users likes on this post
      const likesArray = post.likes.filter(
        (likes) => likes.user.toString() === user.id
      );

      //if user already liked the , remove the like
      if (likesArray.length > 0) {
        //remove the like
        likesArray.forEach((like) => like.remove());
      } else {
        //post not liked, add this user to "liked" array
        post.likes.unshift({ user: user.id });
      }

      await post.save();
      return res.json(post.likes);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  }
);

// @route  PUT api/posts/:id/comment/
// @desc   add a comment to a post
// @access Private
router.put(
  '/:id/comment',
  [
    auth,
    check('content', 'Comment must have content').trim().not().isEmpty(),
    validationCheck,
  ],
  async (req, res) => {
    //get user
    const user = req.user;
    //get post title & content, create a post object
    const { content } = req.body;
    let newComment = { user: user.id, content, date: Date.now() };

    try {
      //find the current post
      let post = await Post.findById(req.params.id);

      //if no post found
      if (!post) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Post does not exist' }] });
      }

      //post does exist, add the comment to the top of the subdoc array
      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  }
);

// @route  DELETE api/posts/:id/comment/:comment_id
// @desc   delete a comment
// @access Private
router.delete('/:id/comment/:commentId', auth, async (req, res) => {
  try {
    //get post and comment id
    const { id, commentId } = req.params;
    //get user
    const user = req.user;

    //find the post
    let post = await Post.findById(id);

    //if post doesn't exist
    if (!post) {
      return res.status(404).json({ errors: [{ msg: 'Post does not exist' }] });
    }

    //check if comment exists
    let comment = post.comments.id(commentId);

    if (!comment) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Comment does not exist' }] });
    }

    //check if comment belongs to the user
    if (comment.user != user.id) {
      return res.status(400).json({ errors: [{ msg: 'Access denied' }] });
    }

    //comment exists and belongs to user, delete it
    comment.remove();

    await post.save();

    res.send(post.comments);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;

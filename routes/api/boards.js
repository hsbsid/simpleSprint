const express = require('express');
const { body, check, param, validationResult } = require('express-validator');
const router = express.Router();
const validationCheck = require('../../middleware/validationCheck');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Board = require('../../models/Board');

// @route  POST api/boards
// @desc   create a new board
// @access Private
router.post(
  '/',
  [
    auth,
    check('title', 'Board must have a title').trim().not().isEmpty(),
    validationCheck,
  ],
  async (req, res) => {
    //get user
    const user = req.user;
    const users = [{ user: user.id, permission: 'Creator' }]; // add this user as creator of the board

    //create new board with standard columns, and a swimlane
    const { title } = req.body;
    const columns = [
      { name: 'Backlog' },
      { name: 'In Progress' },
      { name: 'Completed' },
    ];
    const swimlanes = [{ title: 'My Project', users: [{ user: user.id }] }];
    let newBoard = { users, title, columns, swimlanes };

    try {
      newBoard = new Board(newBoard);

      const post = await newBoard.save();

      res.json(post);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  }
);

// @route  PUT api/boards/:id
// @desc   edit a board (add swimlanes, columns, or change cards)
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

module.exports = router;

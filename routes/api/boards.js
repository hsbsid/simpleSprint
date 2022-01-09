const express = require('express');
const { body, check, param, validationResult } = require('express-validator');
const router = express.Router();
const validationCheck = require('../../middleware/validationCheck');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Board = require('../../models/Board');
const Card = require('../../models/Card');

// @route  GET api/boards
// @desc   get all this user's boards
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    //get all the boards
    let boards = await Board.find({ 'users.user': req.user.id }).sort({
      date: -1,
    });
    res.json(boards);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

// @route  GET api/boards/:id
// @desc   get a board by id
// @access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const boardId = req.params.id;

    //try to find the board
    const board = await Board.findById(boardId);

    //if no board found
    if (!board) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Board does not exist' }] });
    }

    //find all cards for this board
    const cards = await Card.find({ board: boardId });

    let fullBoard = board.toObject();
    fullBoard.cards = cards;

    res.json(fullBoard);
  } catch (error) {
    console.log(error);
    if (error.kind == 'ObjectId') {
      res.status(404).json({ errors: [{ msg: 'Board does not exist' }] });
    }
    res.status(500).send('Server Error');
  }
});

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
    const users = [{ user: user.id, permission: 'Owner' }]; // add this user as creator of the board

    //create new board with standard columns, and a dummy swimlane
    const { title } = req.body;
    const columns = ['Backlog', 'In Progress', 'Completed'];
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
// @desc   edit a board (name, swimlanes, columns, users)
// @access Private
router.put(
  '/:id',
  [
    auth,
    check('title', 'Board must have a title').trim().not().isEmpty(),
    check('swimlanes').custom((swimlanes) => {
      if (!Array.isArray(swimlanes) || swimlanes.length < 1) {
        throw new Error('Invalid Swimlanes');
      }
      return true;
    }),
    check('swimlanes.*.title', 'Swimlanes must have titles')
      .trim()
      .not()
      .isEmpty(),
    check('columns').custom((columns) => {
      if (!Array.isArray(columns) || columns.length < 1) {
        throw new Error('Invalid columns');
      }
      return true;
    }),
    check('columns.*', 'Columns must have titles').trim().not().isEmpty(),
    check('users').custom((users) => {
      if (!Array.isArray(users) || users.length < 1) {
        throw new Error('Invalid Board users');
      }
      return true;
    }),
    validationCheck,
  ],
  async (req, res) => {
    //get user
    const user = req.user;
    //get all board params
    const { users, title, swimlanes, columns } = req.body;
    let newBoard = { users, title, swimlanes, columns };

    try {
      //find the current Board
      let board = await Board.findById(req.params.id);

      //if no board found
      if (!board) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Board does not exist' }] });
      }

      //if user is not authorized
      const boardUsers = board.users;
      const userInBoard = boardUsers.filter((u) => u.user == req.user.id);

      if (userInBoard.length < 1 || userInBoard[0].permission != 'Owner') {
        return res.status(401).json({ errors: [{ msg: 'Access Denied' }] });
      }

      //board does exist and belongs to the user, edit it
      board.overwrite({ ...board, ...newBoard });

      board = await board.save();

      res.json(board);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  }
);

// @route  POST api/boards/cards
// @desc   create a new card
// @access Private
router.post(
  '/:boardId/cards',
  [
    auth,
    check('title', 'Card must have a title').trim().not().isEmpty(),
    check('swimlane', 'Card must have a swimlane').trim().not().isEmpty(),
    check('column', 'Card must have a column').trim().not().isEmpty(),
    validationCheck,
  ],
  async (req, res) => {
    //get user
    const user = req.user;

    //create new card with values
    const boardId = req.params.boardId;
    const { title, swimlane, column } = req.body;
    let newCard = { board: boardId, title, column, swimlane };

    try {
      //check if board exists
      let board = await Board.findById(boardId);

      //if no board found
      if (!board) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Board does not exist' }] });
      }

      //check if swimlane exists
      if (board.swimlanes.filter((s) => s.id == swimlane).length < 1) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Board does not exist' }] });
      }

      //check if column exists
      if (!board.columns.includes(column)) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Board does not exist' }] });
      }

      //if user is not authorized
      const boardUsers = board.users;
      const userInBoard = boardUsers.filter((u) => u.user == req.user.id);

      if (
        userInBoard.length < 1 ||
        (userInBoard[0].permission != 'Owner' &&
          userInBoard[0].permission != 'Edit')
      ) {
        return res.status(401).json({ errors: [{ msg: 'Access Denied' }] });
      }

      //user is authorized, add the card
      newCard = new Card(newCard);

      const card = await newCard.save();

      res.json(card);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;

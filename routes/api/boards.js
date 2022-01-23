const express = require('express');
const { body, check, param, validationResult } = require('express-validator');
const router = express.Router();
const validationCheck = require('../../middleware/validationCheck');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

const ObjectId = require('mongoose').Types.ObjectId;
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
    //get user and id from request
    const userId = req.user._id;
    const boardId = req.params.id;

    //check if the id is valid
    if (!ObjectId.isValid(boardId)) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Board does not exist' }] });
    }

    //try to find the board,
    const board = await Board.findOne({ _id: boardId, 'users.user': userId });

    //if no board found
    if (!board || board.length <= 0) {
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
    check('columns').custom((columns) => {
      if (!Array.isArray(columns) || columns.length < 1) {
        throw new Error('Invalid columns');
      }
      return true;
    }),
    check('columns.*', 'Columns must have titles').trim().not().isEmpty(),
    check('users').custom((users) => {
      if (!Array.isArray(users)) {
        throw new Error('Invalid board user permissions');
      }
      return true;
    }),
    validationCheck,
  ],
  async (req, res) => {
    //get user
    const user = req.user;

    //create new board with standard columns, and a dummy swimlane
    let { title, users, columns } = req.body;
    const swimlanes = [{ title: 'Main', users: [{ user: user.id }] }];
    users = [...users, { user: user.id, permission: 'Owner' }]; // add this user as creator of the board

    let newBoard = { users, title, columns, swimlanes };

    try {
      newBoard = new Board(newBoard);

      const board = await newBoard.save();

      res.json(board);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  }
);

// @route  DELETE api/boards/:id
// @desc   Delete a board, or remove user from the board
// @access Private
router.delete('/:id', [auth, validationCheck], async (req, res) => {
  //get user and id from request
  const userId = req.user._id;
  const boardId = req.params.id;

  //check if the id is valid
  if (!ObjectId.isValid(boardId)) {
    return res.status(404).json({ errors: [{ msg: 'Board does not exist' }] });
  }

  try {
    //find the board as long as this user is in the board
    const board = await Board.findOne({
      _id: boardId,
      users: { $elemMatch: { user: userId } },
    });

    //board does not exist under this user
    if (!board) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Board does not exist' }] });
    }

    //find this user's permissions in the board
    const users = board.users;
    console.log(users);
    const permission = users.find((u) => userId.equals(u.user)).permission;

    //if owner, remove the board
    if (permission.localeCompare('Owner') === 0) {
      //board does exist, remove it
      board.remove();
    } else {
      //otherwise just remove the user from the board
      const newUsers = users.filter((u) => !userId.equals(u.user));
      board.users = newUsers;

      board.save();
    }

    res.json({ _id: boardId });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

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
      const userInBoard = boardUsers.find((u) => u.user == req.user.id);

      if (!userInBoard || userInBoard.permission != 'Owner') {
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

// @route  POST api/boards/:boardId/cards
// @desc   create a new card
// @access Private
router.post(
  '/:boardId/cards',
  [
    auth,
    check('title', 'Card must have a title').trim().not().isEmpty(),
    // check('swimlane', 'Card must have a swimlane').trim().not().isEmpty(),
    check('column', 'Card must have a column').trim().not().isEmpty(),
    validationCheck,
  ],
  async (req, res) => {
    //get user
    const user = req.user;

    //create new card with values
    const boardId = req.params.boardId;
    const { title, swimlane, column } = req.body;
    let newCard = { board: boardId, title, column, users: [user._id] };

    try {
      //check if board exists
      let board = await Board.findById(boardId);

      //if no board found
      if (!board) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Board does not exist' }] });
      }

      // //check if swimlane exists
      // if (board.swimlanes.filter((s) => s.id == swimlane).length < 1) {
      //   return res
      //     .status(404)
      //     .json({ errors: [{ msg: 'Swimlane does not exist' }] });
      // }
      //check if column exists

      if (!board.columns.includes(column)) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Column does not exist' }] });
      }

      //if user is not authorized
      const boardUsers = board.users;
      const userInBoard = boardUsers.find((u) => u.user == req.user.id);

      if (
        !userInBoard ||
        (userInBoard.permission != 'Owner' &&
          userInBoard.permission != 'Collaborator')
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

// @route  PUT api/boards/cards/:cardId
// @desc   edit a card
// @access Private
router.put(
  '/cards/:cardId',
  [
    auth,
    check('title', 'Card must have a title').trim().not().isEmpty(),
    check('column', 'Card must have a column').trim().not().isEmpty(),
    validationCheck,
  ],
  async (req, res) => {
    const { cardId } = req.params;

    //get new card details
    const { title, column } = req.body;
    let newCard = { title, column };

    try {
      let card = await Card.findById(cardId);

      //check if card exists
      if (!card) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Card does not exist' }] });
      }

      //get board
      const board = await Board.findById(card.board);

      //check if this user belongs to the board
      const userInBoard = board.users.find((u) => u.user == req.user.id);

      if (
        !userInBoard ||
        (userInBoard.permission != 'Owner' &&
          userInBoard.permission != 'Collaborator')
      ) {
        return res.status(401).json({ errors: [{ msg: 'Access Denied' }] });
      }

      //check if column exists
      const columnExists = board.columns.find(
        (c) => c.localeCompare(column) === 0
      );

      if (!columnExists) {
        return res.json({ errors: [{ msg: 'Column does not exist' }] });
      }

      //card and column exist, overwrite the card
      card.title = newCard.title;
      card.column = newCard.column;

      card = await card.save();

      res.json(card);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server Error');
    }
  }
);

// @route  DELETE api/boards/cards/:cardId
// @desc   Delete a card
// @access Private
router.delete('/cards/:cardId', auth, async (req, res) => {
  //get user and id from request
  const userId = req.user._id;
  const { cardId } = req.params;

  //check if the id is valid
  if (!ObjectId.isValid(cardId)) {
    return res.status(404).json({ errors: [{ msg: 'Card does not exist' }] });
  }

  try {
    //find the card
    const card = await Card.findById(cardId);
    console.log(cardId);
    //card does not exist
    if (!card) {
      return res.status(404).json({ errors: [{ msg: 'Card does not exist' }] });
    }

    //card does exist, remove it
    card.remove();

    res.json({ _id: cardId });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
